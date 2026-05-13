export interface ContactPayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactConfirmation {
  ticketId: string;
  message: string;
}