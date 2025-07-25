"use server";

import { Resend } from 'resend';
import { messageSchema, type MessageSchema } from '@/lib/validation';
import { summarizeEmail } from '@/ai/flows/summarize-email';

const resend = new Resend(process.env.RESEND_API_KEY);
const MESSAGE_LENGTH_THRESHOLD_FOR_SUMMARY = 500; // characters

export async function sendMessage(data: MessageSchema) {
  const parsed = messageSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "Invalid data provided." };
  }

  const { name, email, subject, message } = parsed.data;

  let summary = '';
  if (message.length > MESSAGE_LENGTH_THRESHOLD_FOR_SUMMARY) {
    try {
      const summaryResult = await summarizeEmail({ emailContent: message });
      summary = summaryResult.summary;
    } catch (error) {
      console.error("AI summarization failed:", error);
      // Do not block email sending if summarization fails
    }
  }

  const emailHtml = `
    <div style="font-family: sans-serif; line-height: 1.6;">
      <h1 style="color: #A78BFA;">New Message via SecureMail</h1>
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      ${summary ? `
        <hr style="border: none; border-top: 1px solid #333;">
        <h2 style="color: #7DD3FC;">AI Summary</h2>
        <p style="font-style: italic; border-left: 3px solid #7DD3FC; padding-left: 1rem;">${summary}</p>
      ` : ''}
      <hr style="border: none; border-top: 1px solid #333;">
      <h2 style="color: #A78BFA;">Full Message</h2>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
  `;

  try {
    await resend.emails.send({
      from: 'SecureMail <onboarding@resend.dev>',
      to: 'neerajrekwar817@gmail.com',
      subject: `New SecureMail: ${subject}`,
      html: emailHtml,
      reply_to: email,
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error: "Failed to send message. Please try again later." };
  }
}
