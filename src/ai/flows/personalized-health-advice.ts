'use server';

/**
 * @fileOverview Personalized health advice generation based on tracked metrics and progress.
 *
 * - generatePersonalizedHealthAdvice - A function that generates personalized health advice.
 * - PersonalizedHealthAdviceInput - The input type for the generatePersonalizedHealthAdvice function.
 * - PersonalizedHealthAdviceOutput - The return type for the generatePersonalizedHealthAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedHealthAdviceInputSchema = z.object({
  patientId: z.string().describe('The ID of the patient.'),
  weekNumber: z.number().describe('The week number in the program.'),
  metrics: z.record(z.string(), z.number()).describe('A map of metric names to their values.'),
  progressSummary: z.string().describe('A summary of the patient\'s progress so far.'),
});
export type PersonalizedHealthAdviceInput = z.infer<typeof PersonalizedHealthAdviceInputSchema>;

const PersonalizedHealthAdviceOutputSchema = z.object({
  advice: z.string().describe('Personalized health advice based on the provided metrics and progress.'),
});
export type PersonalizedHealthAdviceOutput = z.infer<typeof PersonalizedHealthAdviceOutputSchema>;

export async function generatePersonalizedHealthAdvice(
  input: PersonalizedHealthAdviceInput
): Promise<PersonalizedHealthAdviceOutput> {
  return personalizedHealthAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedHealthAdvicePrompt',
  input: {schema: PersonalizedHealthAdviceInputSchema},
  output: {schema: PersonalizedHealthAdviceOutputSchema},
  prompt: `You are a personalized health advisor for Taria Health Compass.

  Based on the patient's tracked metrics, progress summary, and the current week in the program, provide personalized health advice.
  Focus on actionable steps the patient can take to improve their health.

  Patient ID: {{{patientId}}}
  Week Number: {{{weekNumber}}}
  Metrics: {{#each metrics}}{{{@key}}}: {{{this}}} {{/each}}
  Progress Summary: {{{progressSummary}}}

  Provide advice in a concise and encouraging tone.`,
});

const personalizedHealthAdviceFlow = ai.defineFlow(
  {
    name: 'personalizedHealthAdviceFlow',
    inputSchema: PersonalizedHealthAdviceInputSchema,
    outputSchema: PersonalizedHealthAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
