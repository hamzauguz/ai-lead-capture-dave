export interface LeadSubmission {
  name: string;
  email: string;
  inquiry: string;
}

export interface LeadResponse {
  success: boolean;
  aiResponse?: string;
  error?: string;
}
