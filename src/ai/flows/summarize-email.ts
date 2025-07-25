// Summarizes long emails to provide a quick understanding of the key points.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeEmailInputSchema = z.object({
  emailContent: z
    .string()
    .describe('The content of the email to be summarized.'),
});
export type SummarizeEmailInput = z.infer<typeof SummarizeEmailInputSchema>;

const SummarizeEmailOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the email content.'),
});
export type SummarizeEmailOutput = z.infer<typeof SummarizeEmailOutputSchema>;

export async function summarizeEmail(input: SummarizeEmailInput): Promise<SummarizeEmailOutput> {
  return summarizeEmailFlow(input);
}

const summarizeEmailPrompt = ai.definePrompt({
  name: 'summarizeEmailPrompt',
  input: {schema: SummarizeEmailInputSchema},
  output: {schema: SummarizeEmailOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing emails.

  Please provide a concise summary of the following email content:

  {{emailContent}}
  `,
});

const summarizeEmailFlow = ai.defineFlow(
  {
    name: 'summarizeEmailFlow',
    inputSchema: SummarizeEmailInputSchema,
    outputSchema: SummarizeEmailOutputSchema,
  },
  async input => {
    const {output} = await summarizeEmailPrompt(input);
    return output!;
  }
);
