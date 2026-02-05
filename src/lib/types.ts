export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'staff';
  avatarUrl?: string;
};

export type Ambulance = {
  id: number;
  reg_no: string;
  fuel_cost: number;
  operation_cost: number;
  target: number;
  last_driven_by?: string;
  last_driven_on?: string;
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
