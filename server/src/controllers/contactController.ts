import type { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CONFIG } from '../config.js';
import { BadRequestError, ServiceUnavailableError } from '../utils/errors.js';

const contactSchema = z.object({
  name: z.string().min(1).max(50),
  email: z.string().email().max(100).optional().or(z.literal('')),
  subject: z.string().min(1).max(100),
  message: z.string().min(10).max(2000),
});

export async function sendContactHandler(req: Request, res: Response, next: NextFunction) {
  try {
    if (!CONFIG.SMTP2GO_API_KEY || !CONFIG.SMTP2GO_SENDER || !CONFIG.CONTACT_RECIPIENT) {
      throw new ServiceUnavailableError('Contact form is not configured');
    }

    const parsed = contactSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new BadRequestError(parsed.error.errors[0]?.message ?? 'Invalid input');
    }

    const { name, email, subject, message } = parsed.data;

    const html = `
      <h2>New message from Delilah's World</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      ${email ? `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` : ''}
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <hr />
      <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
    `;

    const text = `Name: ${name}\nEmail: ${email ?? 'Not provided'}\nSubject: ${subject}\n\n${message}`;

    const response = await fetch('https://api.smtp2go.com/v3/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: CONFIG.SMTP2GO_API_KEY,
        to: [CONFIG.CONTACT_RECIPIENT],
        sender: CONFIG.SMTP2GO_SENDER,
        subject: `[Delilah's World] ${subject}`,
        html,
        text,
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => 'Unknown error');
      throw new ServiceUnavailableError(`Failed to send message: ${body}`);
    }

    res.status(200).json({ success: true, message: 'Message sent' });
  } catch (error) {
    next(error);
  }
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
