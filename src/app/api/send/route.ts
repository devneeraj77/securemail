import { Resend } from 'resend';
import {NextResponse} from 'next/server';
import { messageSchema } from '@/lib/validation';
import { summarizeEmail } from '@/ai/flows/summarize-email';

const resend = new Resend('re_22nvk84C_B1vPN4anxoZQ9hMqBBKmHs2Q');
const MESSAGE_LENGTH_THRESHOLD_FOR_SUMMARY = 500; // characters


export async function POST(request: Request) {
  const body = await request.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
  }

  const { name, email, subject, message } = parsed.data;

  let summary = '';
  if (message.length > MESSAGE_LENGTH_THRESHOLD_FOR_SUMMARY) {
    try {
      const summaryResult = await summarizeEmail({ emailContent: message });
      summary = summaryResult.summary;
    } catch (error)      {
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
    const data = await resend.emails.send({
      from: 'SecureMail <onboarding@resend.dev>',
      to: ['dev.neerajrekwar@gmail.com'],
      subject: `New SecureMail: ${subject}`,
      html: emailHtml,
      reply_to: email,
    });

    return NextResponse.json({success: true, data });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json({ success: false, error: "Failed to send message. Please try again later." }, { status: 500 });
  }
}
