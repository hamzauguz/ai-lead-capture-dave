import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { LeadSubmission } from "./types";

export interface StoredLead extends LeadSubmission {
  id: string;
  createdAt: string;
  aiResponse: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

async function ensureDataFile(): Promise<StoredLead[]> {
  await mkdir(DATA_DIR, { recursive: true });

  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoredLead[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    await writeFile(DATA_FILE, "[]", "utf-8");
    return [];
  }
}

async function writeLeads(leads: StoredLead[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(leads, null, 2), "utf-8");
}

export async function saveLead(
  lead: LeadSubmission,
  aiResponse: string
): Promise<StoredLead> {
  const leads = await ensureDataFile();

  const storedLead: StoredLead = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    name: lead.name,
    email: lead.email,
    inquiry: lead.inquiry,
    aiResponse,
  };

  leads.unshift(storedLead);
  await writeLeads(leads);

  return storedLead;
}

export async function getLeads(): Promise<StoredLead[]> {
  return ensureDataFile();
}
