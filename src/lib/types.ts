export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatarUrl?: string;
  password?: string;
};

export type Ambulance = {
  id: number;
  reg_no: string;
  fuel_cost: number;
  operation_cost: number;
  target: number;
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
};
