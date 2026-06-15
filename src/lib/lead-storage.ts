import type { StoredLead } from "./types";

const STORAGE_KEY = "dave-lead-capture-leads";

export function getBrowserLeads(): StoredLead[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as StoredLead[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBrowserLead(lead: StoredLead): void {
  if (typeof window === "undefined") {
    return;
  }

  const leads = getBrowserLeads();
  leads.unshift(lead);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
}
