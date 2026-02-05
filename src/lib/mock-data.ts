import type { Parameter } from './types';

export const parameters: Parameter[] = [
  {
    id: 1,
    name: 'Blood Pressure (Systolic)',
    type: 'numerical',
    unit: 'mmHg',
  },
  {
    id: 2,
    name: 'Blood Pressure (Diastolic)',
    type: 'numerical',
    unit: 'mmHg',
  },
  {
    id: 3,
    name: 'Daily Steps',
    type: 'numerical',
    unit: 'steps',
  },
  {
    id: 4,
    name: 'Weight',
    type: 'numerical',
    unit: 'kg',
  },
  {
    id: 5,
    name: 'Smoking Status',
    type: 'choice',
    choices: ['Non-smoker', 'Former smoker', 'Current smoker'],
  },
  {
    id: 6,
    name: 'Weekly Exercise Frequency',
    type: 'choice',
    choices: ['1-2 times a week', '3-4 times a week', '5+ times a week', 'None'],
  },
];
