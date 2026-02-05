import type { Transaction, Ambulance, Driver, EmergencyTechnician, User } from './types';

export const ambulances: Ambulance[] = [
  { id: 1, reg_no: 'KDJ 456A', fuel_cost: 5000, operation_cost: 2000, target: 15000 },
  { id: 2, reg_no: 'KCM 789B', fuel_cost: 5500, operation_cost: 2200, target: 18000 },
  { id: 3, reg_no: 'KDN 123C', fuel_cost: 4800, operation_cost: 1900, target: 14000 },
];

export const drivers: Driver[] = [
  { id: 1, name: 'John Doe', avatarUrl: 'https://picsum.photos/seed/driver1/200/200' },
  { id: 2, name: 'Peter Jones', avatarUrl: 'https://picsum.photos/seed/driver2/200/200' },
  { id: 3, name: 'Mary Jane', avatarUrl: 'https://picsum.photos/seed/driver3/200/200' },
];

export const emergencyTechnicians: EmergencyTechnician[] = [
  { id: 1, name: 'Susan Smith', avatarUrl: 'https://picsum.photos/seed/staff1/200/200' },
  { id: 2, name: 'Anne Williams', avatarUrl: 'https://picsum.photos/seed/staff2/200/200' },
  { id: 3, name: 'Mike Brown', avatarUrl: 'https://picsum.photos/seed/staff3/200/200' },
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
      emergency_technicians: [emergencyTechnicians[0]],
      total_till: 22000,
      target: 15000,
      fuel: 5000,
      operation: 2000,
      cash_deposited_by_staff: 8500,
    },
    {
      date: '2024-07-28',
      ambulance: ambulances[1],
      driver: drivers[1],
      emergency_technicians: [emergencyTechnicians[1]],
      total_till: 17500,
      target: 18000,
      fuel: 5500,
      operation: 2200,
      cash_deposited_by_staff: 9800,
    },
     {
      date: '2024-07-27',
      ambulance: ambulances[2],
      driver: drivers[2],
      emergency_technicians: [emergencyTechnicians[2]],
      total_till: 18000,
      target: 14000,
      fuel: 4800,
      operation: 1900,
      cash_deposited_by_staff: 7600,
    },
     {
      date: '2024-07-27',
      ambulance: ambulances[0],
      driver: drivers[0],
      emergency_technicians: [emergencyTechnicians[1], emergencyTechnicians[2]],
      total_till: 13000,
      target: 15000,
      fuel: 5000,
      operation: 2000,
      cash_deposited_by_staff: 6000,
    },
  ];

  return data.map((t, index) => {
    const totalTill = t.total_till || 0;
    const fuel = t.fuel || 0;
    const operation = t.operation || 0;
    const target = t.target || 0;
    const cashDeposited = t.cash_deposited_by_staff || 0;

    // Business logic from PHP model
    const amount_paid_to_the_till = totalTill - cashDeposited;
    const offload = totalTill - fuel - operation;
    const salary = (offload - target) >= 0 ? (offload - target) : 0;
    const operations_cost = operation + salary;
    const net_banked = totalTill - fuel - operation - salary;
    const deficit = target - net_banked;
    const performance = target > 0 ? net_banked / target : 0;
    const fuel_revenue_ratio = totalTill > 0 ? fuel / totalTill : 0;

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
