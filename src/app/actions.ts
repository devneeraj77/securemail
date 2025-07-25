"use server";

import { summarizeEmail } from '@/ai/flows/summarize-email';
import { messageSchema, type MessageSchema } from '@/lib/validation';

// This function is no longer called by the form, 
// but is kept here as it might be used by other parts of the application.
export async function getSummary(message: string): Promise<string> {
  const MESSAGE_LENGTH_THRESHOLD_FOR_SUMMARY = 500; // characters
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
  return summary;
}
