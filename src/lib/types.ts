export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'navigator' | 'payer' | 'physician';
  avatarUrl?: string;
};

export type Corporate = {
  id: number;
  name: string;
  wellness_date: string;
};

// This represents a row in the `registrations` table
export type Patient = {
  id: number;
  first_name: string;
  middle_name?: string;
  surname?: string;
  sex?: 'Male' | 'Female' | 'Other';
  dob?: string;
  age?: number;
  phone?: string;
  email?: string;
  wellness_date: string;
  user_id?: number;
  corporate_id?: number;
  created_at: string;
  updated_at?: string;

  // Joined data
  corporate_name?: string;

  // Relations
  vitals?: Vital[];
  nutrition?: Nutrition[];
  goals?: Goal[];
  clinicals?: Clinical[];
};

export type Vital = {
  id: number;
  patient_id: number; // Mapped from registration_id
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temp?: number;
  rbs?: string;
  user_id?: number;
  measured_at?: string;
};

export type Nutrition = {
  id: number;
  patient_id: number; // Mapped from registration_id
  height?: number;
  weight?: number;
  bmi?: number;
  visceral_fat?: number;
  body_fat_percent?: number;
  notes_nutritionist?: string;
  user_id?: number;
};

export type Goal = {
  id: number;
  patient_id: number; // Mapped from registration_id
  user_id: number;
  discussion?: string;
  goal?: string;
};

export type Clinical = {
  id: number;
  patient_id: number; // Mapped from registration_id
  notes_psychologist?: string;
  notes_doctor?: string;
  user_id?: number;
};

export type AppData = {
  loggedInUser: User;
  patients: Patient[];
  corporates: Corporate[];
};
