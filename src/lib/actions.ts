'use server';

import { generatePersonalizedHealthAdvice } from '@/ai/flows/personalized-health-advice';
import type { PersonalizedHealthAdviceInput } from '@/ai/flows/personalized-health-advice';
import { healthData } from './data';

function parseMetricValue(value: string): number {
    const numericPart = value.split(' ')[0];
    if (numericPart.includes('/')) {
        return parseFloat(numericPart.split('/')[0]);
    }
    return parseFloat(numericPart);
}

export async function getHealthAdvice() {
  try {
    const metricsForAI = healthData.metrics.reduce((acc, metric) => {
      const parsedValue = parseMetricValue(metric.value);
      if (!isNaN(parsedValue)) {
        acc[metric.name] = parsedValue;
      }
      return acc;
    }, {} as Record<string, number>);

    const input: PersonalizedHealthAdviceInput = {
      patientId: 'patient-001', // mock patient id
      weekNumber: healthData.weekNumber,
      metrics: metricsForAI,
      progressSummary: healthData.progressSummary,
    };

    const result = await generatePersonalizedHealthAdvice(input);
    return { success: true, advice: result.advice };
  } catch (error) {
    console.error('Error generating health advice:', error);
    return { success: false, error: 'Failed to generate health advice. Please try again later.' };
  }
}
