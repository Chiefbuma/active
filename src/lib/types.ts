export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff' | 'navigator' | 'payer' | 'physician';
  avatarUrl: string;
};

export type Corporate = {
  id: number;
  name: string;
  wellness_date: string;
};

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
  user_id?: number;
  corporate_id?: number;
  created_at: string;
  vitals?: Vital[];
  nutrition?: Nutrition[];
  goals?: Goal[];
  clinical?: Clinical[];
};

export type Vital = {
  id: number;
  registration_id: number;
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
  registration_id: number;
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
  registration_id: number;
  user_id: number;
  discussion?: string;
  goal?: string;
};

export type Clinical = {
  id: number;
  registration_id: number;
  notes_psychologist?: string;
  notes_doctor?: string;
  user_id?: number;
};

export type AppData = {
  loggedInUser: User;
  patients: Patient[];
  corporates: Corporate[];
};
