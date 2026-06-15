export interface LeadSubmission {
  name: string;
  email: string;
  inquiry: string;
}

export interface StoredLead extends LeadSubmission {
  id: string;
  createdAt: string;
  aiResponse: string;
}

export interface LeadResponse {
  success: boolean;
  aiResponse?: string;
  lead?: StoredLead;
  error?: string;
}
