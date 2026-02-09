import type { Parameter } from '@/lib/types';

export const parameters: Parameter[] = [
  { id: 1, name: 'Weight', unit: 'kg', type: 'numerical' },
  { id: 2, name: 'Daily Steps', unit: 'steps', type: 'numerical' },
  { id: 3, name: 'Blood Pressure (Systolic)', unit: 'mmHg', type: 'numerical' },
  { id: 4, name: 'Blood Pressure (Diastolic)', unit: 'mmHg', type: 'numerical' },
  { id: 5, name: 'Smoking Status', type: 'choice', choices: ['Non-smoker', 'Ex-smoker', 'Current smoker'] },
  { id: 6, name: 'Alcohol Consumption', unit: 'units/week', type: 'numerical' },
];
