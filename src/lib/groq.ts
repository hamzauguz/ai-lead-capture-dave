import OpenAI from "openai";
import { CLIENT } from "./config";
import type { LeadSubmission } from "./types";

const DEFAULT_MODEL = "llama-3.3-70b-versatile";

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Groq API key is not configured");
  }

  return new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });
}

export async function generatePersonalizedResponse(
  lead: LeadSubmission
): Promise<string> {
  const groq = getGroqClient();

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || DEFAULT_MODEL,
    temperature: 0.7,
    max_tokens: 300,
    messages: [
      {
        role: "system",
        content: `You are a friendly business assistant for ${CLIENT.businessName}. Write a short, warm, personalized reply to a website inquiry on ${CLIENT.name}'s behalf. Keep it under 120 words. Do not use placeholders.`,
      },
      {
        role: "user",
        content: `Name: ${lead.name}\nEmail: ${lead.email}\nInquiry: ${lead.inquiry}`,
      },
    ],
  });

  const message = completion.choices[0]?.message?.content?.trim();

  if (!message) {
    throw new Error("Groq returned an empty response");
  }

  return message;
}
