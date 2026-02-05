import type { Transaction, Ambulance, Driver, MedicalStaff, User, Parameter } from './types';

export const ambulances: Ambulance[] = [
  { id: 1, reg_no: 'KDJ 456A', fuel_cost: 5000, operation_cost: 2000, target: 15000 },
  { id: 2, reg_no: 'KCM 789B', fuel_cost: 5500, operation_cost: 2200, target: 18000 },
  { id: 3, reg_no: 'KDN 123C', fuel_cost: 4800, operation_cost: 1900, target: 14000 },
];

export const drivers: Driver[] = [
  { id: 1, first_name: 'John', last_name: 'Doe', avatarUrl: 'https://picsum.photos/seed/driver1/200/200' },
  { id: 2, first_name: 'Peter', last_name: 'Jones', avatarUrl: 'https://picsum.photos/seed/driver2/200/200' },
  { id: 3, first_name: 'Mary', last_name: 'Jane', avatarUrl: 'https://picsum.photos/seed/driver3/200/200' },
];

export const medicalStaff: MedicalStaff[] = [
  { id: 1, first_name: 'Susan', last_name: 'Smith', avatarUrl: 'https://picsum.photos/seed/staff1/200/200' },
  { id: 2, first_name: 'Anne', last_name: 'Williams', avatarUrl: 'https://picsum.photos/seed/staff2/200/200' },
  { id: 3, first_name: 'Mike', last_name: 'Brown', avatarUrl: 'https://picsum.photos/seed/staff3/200/200' },
];

export const users: User[] = [
    { id: 1, name: 'Admin User', email: 'admin@example.com', role: 'admin', avatarUrl: 'https://picsum.photos/seed/user1/200/200' },
    { id: 2, name: 'Staff User', email: 'staff@example.com', role: 'staff', avatarUrl: 'https://picsum.photos/seed/user2/200/200' }
];

const generateTransactions = (): Transaction[] => {
  const data: Omit<Transaction, 'id' | 'amount_paid_to_the_till' | 'offload' | 'salary' | 'operations_cost' | 'net_banked' | 'deficit' | 'performance' | 'fuel_revenue_ratio'>[] = [
    {
      date: '2024-07-28',
      ambulance: ambulances[0],
      driver: drivers[0],
      medical_staff: medicalStaff[0],
      total_till: 16000,
      target: 15000,
      fuel: 5000,
      operation: 2000,
      police: 500,
      cash_deposited_by_staff: 8500,
    },
    {
      date: '2024-07-28',
      ambulance: ambulances[1],
      driver: drivers[1],
      medical_staff: medicalStaff[1],
      total_till: 17500,
      target: 18000,
      fuel: 5500,
      operation: 2200,
      police: 0,
      cash_deposited_by_staff: 9800,
    },
     {
      date: '2024-07-27',
      ambulance: ambulances[2],
      driver: drivers[2],
      medical_staff: medicalStaff[2],
      total_till: 14500,
      target: 14000,
      fuel: 4800,
      operation: 1900,
      police: 200,
      cash_deposited_by_staff: 7600,
    },
     {
      date: '2024-07-27',
      ambulance: ambulances[0],
      driver: drivers[0],
      medical_staff: medicalStaff[1],
      total_till: 13000,
      target: 15000,
      fuel: 5000,
      operation: 2000,
      police: 0,
      cash_deposited_by_staff: 6000,
    },
  ];

  return data.map((t, index) => {
    const operations_cost = t.fuel + t.operation + t.police;
    const amount_paid_to_the_till = t.total_till - operations_cost;
    const offload = t.total_till < t.target ? t.target - t.total_till : 0;
    const surplus = t.total_till > t.target ? t.total_till - t.target : 0;
    const salary = surplus * 0.4;
    const net_banked = t.total_till - (operations_cost + salary);
    const deficit = net_banked > 0 ? 0 : amount_paid_to_the_till - t.cash_deposited_by_staff;
    const performance = t.target > 0 ? t.total_till / t.target : 0;
    const fuel_revenue_ratio = t.total_till > 0 ? t.fuel / t.total_till : 0;

    return {
      ...t,
      id: index + 1,
      operations_cost,
      amount_paid_to_the_till,
      offload,
      salary,
      net_banked,
      deficit,
      performance,
      fuel_revenue_ratio
    };
  });
};

export const transactions: Transaction[] = generateTransactions();

export const parameters: Parameter[] = [
  { id: 1, name: 'Weight', type: 'numerical', unit: 'kg' },
  { id: 2, name: 'Blood Pressure (Systolic)', type: 'numerical', unit: 'mmHg' },
  { id: 3, name: 'Daily Steps', type: 'numerical', unit: 'steps' },
  { id: 4, name: 'Smoking Status', type: 'choice', choices: ['Non-smoker', 'Former smoker', 'Current smoker'] },
  { id: 5, name: 'Alcohol Consumption', type: 'choice', choices: ['Abstinent', 'Occasional', 'Regular'] },
];
