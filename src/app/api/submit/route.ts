import { NextResponse } from "next/server";
import { generatePersonalizedResponse } from "@/lib/groq";
import { saveLead } from "@/lib/local-db";
import type { LeadSubmission } from "@/lib/types";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateLead(body: Partial<LeadSubmission>): string | null {
  const name = body.name?.trim();
  const email = body.email?.trim();
  const inquiry = body.inquiry?.trim();

  if (!name || name.length < 2) {
    return "Please enter your name.";
  }

  if (!email || !isValidEmail(email)) {
    return "Please enter a valid email address.";
  }

  if (!inquiry || inquiry.length < 10) {
    return "Please enter an inquiry with at least 10 characters.";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Groq API key is not configured." },
        { status: 500 }
      );
    }

    const body = (await request.json()) as Partial<LeadSubmission>;
    const validationError = validateLead(body);

    if (validationError) {
      return NextResponse.json(
        { success: false, error: validationError },
        { status: 400 }
      );
    }

    const lead: LeadSubmission = {
      name: body.name!.trim(),
      email: body.email!.trim(),
      inquiry: body.inquiry!.trim(),
    };

    const aiResponse = await generatePersonalizedResponse(lead);
    await saveLead(lead, aiResponse);

    return NextResponse.json({ success: true, aiResponse });
  } catch (error) {
    console.error("Lead submission failed:", error);

    const message =
      error instanceof Error ? error.message : "Something went wrong.";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
