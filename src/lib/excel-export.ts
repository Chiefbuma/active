import * as XLSX from 'xlsx';

/**
 * Export ambulance performance summary to Excel
 */
export function exportSummaryToExcel(
  data: any[],
  periodLabel: string
) {
  const fileName = `Ambulance_Performance_Summary_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Format data for export, removing ambulanceId and performance
  const formattedData = data.map(item => ({
    'Ambulance': item.reg_no,
    'Total Till': item.total_till,
    'Cash Deposited': item.total_cash_deposited,
    'Net Banked': item.total_net_banked,
    'Deficit': item.total_deficit,
  }));
  
  // Create worksheet with data
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // Ambulance
    { wch: 18 }, // Total Till
    { wch: 18 }, // Cash Deposited
    { wch: 15 }, // Net Banked
    { wch: 12 }, // Deficit
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Summary');
  
  // Add metadata sheet
  const metaWs = XLSX.utils.aoa_to_sheet([
    ['Ambulance Performance Analysis'],
    ['Period', periodLabel],
    ['Generated', new Date().toLocaleString()],
  ]);
  XLSX.utils.book_append_sheet(wb, metaWs, 'Info');
  
  // Write file
  XLSX.writeFile(wb, fileName);
}

/**
 * Export detailed transactions to Excel
 */
export function exportDetailedToExcel(
  data: any[],
  periodLabel: string
) {
  const fileName = `Transaction_Details_${new Date().toISOString().split('T')[0]}.xlsx`;
  
  // Format data for export
  const formattedData = data.map(row => ({
    'ID': row.id,
    'Date': new Date(row.date).toLocaleDateString(),
    'Ambulance': row.ambulance?.reg_no || '-',
    'Driver': row.driver?.name || '-',
    'Total Till': row.total_till,
    'Target': row.target,
    'Fuel': row.fuel,
    'Operation': row.operation,
    'Cash Deposited': row.cash_deposited_by_staff,
    'Amount Paid to Till': row.amount_paid_to_the_till,
    'Offload': row.offload,
    'Salary': row.salary,
    'Operations Cost': row.operations_cost,
    'Net Banked': row.net_banked,
    'Deficit': row.deficit,
    'Performance': (row.performance * 100).toFixed(0) + '%',
    'Fuel Revenue Ratio': (row.fuel_revenue_ratio * 100).toFixed(2) + '%',
  }));
  
  // Create worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);
  
  // Set column widths
  ws['!cols'] = [
    { wch: 8 },   // ID
    { wch: 12 },  // Date
    { wch: 12 },  // Ambulance
    { wch: 15 },  // Driver
    { wch: 12 },  // Total Till
    { wch: 12 },  // Target
    { wch: 10 },  // Fuel
    { wch: 12 },  // Operation
    { wch: 15 },  // Cash Deposited
    { wch: 16 },  // Amount Paid to Till
    { wch: 10 },  // Offload
    { wch: 10 },  // Salary
    { wch: 15 },  // Operations Cost
    { wch: 12 },  // Net Banked
    { wch: 10 },  // Deficit
    { wch: 12 },  // Performance
    { wch: 16 },  // Fuel Revenue Ratio
  ];
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
  
  // Add metadata sheet
  const metaWs = XLSX.utils.aoa_to_sheet([
    ['Transaction Details'],
    ['Period', periodLabel],
    ['Total Records', formattedData.length],
    ['Generated', new Date().toLocaleString()],
  ]);
  XLSX.utils.book_append_sheet(wb, metaWs, 'Info');
  
  // Write file
  XLSX.writeFile(wb, fileName);
}
