export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatarUrl?: string;
  password?: string;
};

export type Corporate = {
  id: number;
  name: string;
  wellness_date: string;
};

export type Vital = {
  id: number;
  bp_systolic: number;
  bp_diastolic: number;
  pulse: number;
  temp: number;
  rbs: string;
  measured_at: string;
};

export type Nutrition = {
  id: number;
  height: number;
  weight: number;
  bmi: number;
  visceral_fat: number;
  body_fat_percent: number;
  notes_nutritionist?: string;
};

export type Goal = {
  id: number;
  discussion?: string;
  goal?: string;
};

export type Clinical = {
  id: number;
  notes_doctor?: string;
  notes_psychologist?: string;
};

export type Patient = {
  id: number;
  first_name: string;
  middle_name?: string;
  surname?: string;
  sex: 'Male' | 'Female' | 'Other';
  dob?: string;
  age?: number;
  phone?: string;
  email?: string;
  corporate_id?: number;
  corporate_name?: string;
  wellness_date?: string;
  user_id?: number;
  created_at: string;
  updated_at: string;
  vitals?: Vital[];
  nutrition?: Nutrition[];
  goals?: Goal[];
  clinicals?: Clinical[];
};

export type Parameter = {
  id: number;
  name: string;
  unit?: string;
  type: 'numerical' | 'choice';
  choices?: string[];
};

export type Ambulance = {
  id: number;
  reg_no: string;
  fuel_cost: number;
  operation_cost: number;
  target: number;
  last_driven_by?: string;
  last_driven_on?: string;
  status: "active" | "inactive";
};

export type Driver = {
  id: number;
  name: string;
  avatarUrl?: string;
}

export type EmergencyTechnician = {
  id: number;
  name: string;
  avatarUrl?: string;
}

export type Transaction = {
    id: number;
    date: string;
    ambulance: Ambulance;
    driver: Driver;
    emergency_technicians: EmergencyTechnician[];
    total_till: number;
    target: number;
    fuel: number;
    operation: number;
    cash_deposited_by_staff: number;
    // Calculated fields
    amount_paid_to_the_till: number;
    offload: number;
    salary: number;
    operations_cost: number;
    net_banked: number;
    deficit: number;
    fuel_revenue_ratio: number;
    performance: number;
}

export type AmbulancePerformanceData = {
    ambulanceId: number;
    reg_no: string;
    total_target: number;
    total_net_banked: number;
    avg_performance: number;
}

export type PeriodComparisonData = {
    net_banked: number;
    deficit: number;
}

export type AdminDashboardData = {
    total_target: number;
    total_net_banked: number;
    total_till: number;
    total_deficit: number;
    overall_performance: number;
    ambulance_performance: AmbulancePerformanceData[];
    period_comparison: {
        current: PeriodComparisonData;
        previous: PeriodComparisonData;
    };
};
