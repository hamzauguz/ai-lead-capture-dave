import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { LeadSubmission } from "./types";

export interface StoredLead extends LeadSubmission {
  id: string;
  createdAt: string;
  aiResponse: string;
}

const globalStore = globalThis as typeof globalThis & {
  __leadCaptureStore?: StoredLead[];
};

function isServerless(): boolean {
  return process.env.VERCEL === "1" || Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME);
}

function getDataPaths() {
  if (isServerless()) {
    const dir = path.join("/tmp", "ai-lead-capture");
    return { dir, file: path.join(dir, "leads.json") };
  }

  const dir = path.join(process.cwd(), "data");
  return { dir, file: path.join(dir, "leads.json") };
}

function getMemoryStore(): StoredLead[] {
  if (!globalStore.__leadCaptureStore) {
    globalStore.__leadCaptureStore = [];
  }

  return globalStore.__leadCaptureStore;
}

async function readLeadsFromFile(): Promise<StoredLead[]> {
  const { dir, file } = getDataPaths();

  try {
    await mkdir(dir, { recursive: true });
    const raw = await readFile(file, "utf-8");
    const parsed = JSON.parse(raw) as StoredLead[];

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
}

async function writeLeadsToFile(leads: StoredLead[]): Promise<void> {
  const { dir, file } = getDataPaths();
  await mkdir(dir, { recursive: true });
  await writeFile(file, JSON.stringify(leads, null, 2), "utf-8");
}

async function ensureDataFile(): Promise<StoredLead[]> {
  if (isServerless()) {
    const memoryLeads = getMemoryStore();

    if (memoryLeads.length > 0) {
      return memoryLeads;
    }

    const fileLeads = await readLeadsFromFile();
    globalStore.__leadCaptureStore = fileLeads;
    return fileLeads;
  }

  try {
    const leads = await readLeadsFromFile();

    if (leads.length === 0) {
      await writeLeadsToFile([]);
    }

    return leads;
  } catch {
    await writeLeadsToFile([]);
    return [];
  }
}

async function writeLeads(leads: StoredLead[]): Promise<void> {
  if (isServerless()) {
    globalStore.__leadCaptureStore = leads;

    try {
      await writeLeadsToFile(leads);
    } catch (error) {
      console.warn("Could not persist leads to /tmp:", error);
    }

    return;
  }

  await writeLeadsToFile(leads);
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
