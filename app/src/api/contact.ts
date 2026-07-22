import { apiPost } from './client';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(data: ContactFormData): Promise<void> {
  await apiPost('/api/contact', data);
}
