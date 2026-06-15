import { NextResponse } from "next/server";
import { getLeads } from "@/lib/local-db";

export async function GET() {
  try {
    const leads = await getLeads();
    return NextResponse.json({ success: true, leads });
  } catch (error) {
    console.error("Failed to read leads:", error);

    const message =
      error instanceof Error ? error.message : "Failed to load leads.";

    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
