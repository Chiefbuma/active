import type { AppData } from './types';
import { placeholderImages } from './placeholder-images';

export const mockData: AppData = {
  loggedInUser: {
    id: 1,
    name: 'Dr. Emily Carter',
    email: 'emily.carter@taria.health',
    role: 'physician',
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
  },
  corporates: [
    { id: 1, name: 'Bio Food Products', wellness_date: '2025-09-29' },
    { id: 2, name: 'Ikomoko', wellness_date: '2025-10-01' },
    { id: 3, name: 'Taria', wellness_date: '2025-10-01' },
  ],
  patients: [
    {
      id: 1,
      first_name: 'Sylvester',
      surname: 'Musa',
      sex: 'Male',
      dob: '1997-01-01',
      age: 28,
      phone: '743955149',
      email: 'musasylvester1065@gmail.com',
      corporate_id: 1,
      created_at: '2025-09-29 13:10:46',
      vitals: [
        { id: 1, registration_id: 1, bp_systolic: 114, bp_diastolic: 73, pulse: 58, temp: 36.4, rbs: '5.1' }
      ],
      nutrition: [
        { id: 1, registration_id: 1, height: 169, weight: 64.8, bmi: 23, visceral_fat: 2, body_fat_percent: 10.3, notes_nutritionist: 'normal nutritional status' }
      ],
      goals: [
        { id: 1, registration_id: 1, user_id: 1, discussion: 'Patient wants to improve cardiovascular health and reduce stress.', goal: 'Incorporate 30 minutes of moderate cardio exercise 3 times a week. Practice mindfulness meditation for 10 minutes daily.' }
      ],
      clinical: [
        { id: 1, registration_id: 1, user_id: 1, notes_doctor: 'Patient is in good health. Advised on consistent exercise and a balanced diet. Follow up in 6 months.', notes_psychologist: 'No immediate concerns. Patient seems well-adjusted and motivated.' }
      ]
    },
    {
      id: 2,
      first_name: 'Tom',
      middle_name: 'Mbalala',
      surname: 'Wawire',
      sex: 'Male',
      dob: '1970-01-01',
      age: 55,
      phone: '729089363',
      email: 'tommbalala@20.com',
      corporate_id: 1,
      created_at: '2025-09-29 13:10:46',
       vitals: [
        { id: 2, registration_id: 2, bp_systolic: 150, bp_diastolic: 99, pulse: 62, temp: 36.4, rbs: '6.2' }
      ],
       nutrition: [
        { id: 2, registration_id: 2, height: 175, weight: 84, bmi: 27 }
      ],
      goals: [
        { id: 2, registration_id: 2, user_id: 1, discussion: 'Patient is concerned about his high blood pressure reading and wants to manage it better.', goal: 'Reduce daily sodium intake to under 2,300mg. Monitor blood pressure at home weekly and keep a log.' }
      ],
      clinical: [
        { id: 2, registration_id: 2, user_id: 1, notes_doctor: 'Diagnosed with Stage 1 Hypertension. Prescribed Lisinopril 10mg. Advised on lifestyle modifications, particularly diet and exercise. Follow up in 1 month to check BP.', notes_psychologist: 'Patient is showing signs of anxiety related to his new diagnosis. Provided resources for stress management.' }
      ]
    },
    {
      id: 3,
      first_name: 'Euticus',
      middle_name: 'Matumbi',
      surname: 'Muthuri',
      sex: 'Male',
      dob: '1991-01-01',
      age: 34,
      phone: '742025594',
      email: 'matumbieutychus@gmail.com',
      created_at: '2025-09-29 13:10:46',
      vitals: [
        { id: 3, registration_id: 3, bp_systolic: 133, bp_diastolic: 81, pulse: 70, temp: 36.1, rbs: 'NOT SUPPORTED' }
      ],
       nutrition: [
        { id: 3, registration_id: 3, height: 169, weight: 81, bmi: 28, notes_nutritionist: 'ecouraged on excercise' }
      ]
    },
     {
      id: 4,
      first_name: 'Paul',
      surname: 'Ratemo',
      sex: 'Male',
      dob: '1985-01-01',
      age: 40,
      phone: '743760460',
      email: 'paulratemo84@gmail.com',
      created_at: '2025-09-29 13:10:46',
      vitals: [
        { id: 4, registration_id: 4, bp_systolic: 135, bp_diastolic: 89, pulse: 74, temp: 37, rbs: '5.5' }
      ],
       nutrition: [
        { id: 4, registration_id: 4, height: 181, weight: 74.8, bmi: 23, visceral_fat: 6, body_fat_percent: 18.5, notes_nutritionist: 'encouraged on exercise' }
      ]
    },
    {
      id: 5,
      first_name: 'Kingsley',
      surname: 'Otieno',
      sex: 'Male',
      dob: '1976-01-01',
      age: 49,
      phone: '724785997',
      email: 'nyakrojala@gmail.com',
      created_at: '2025-09-29 13:10:46',
       vitals: [
        { id: 5, registration_id: 5, bp_systolic: 171, bp_diastolic: 118, pulse: 76, temp: 37, rbs: '5.8' }
      ]
    }
  ],
};
