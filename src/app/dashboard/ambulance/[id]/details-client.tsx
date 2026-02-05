'use client';

import { useState } from 'react';
import type { Ambulance, Transaction } from '@/lib/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  ArrowLeft,
  PlusCircle,
  Save,
  XCircle,
  Loader2,
  DollarSign,
  Fuel,
  Wrench,
  User,
  CalendarDays,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { getColumns } from './transactions-columns';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { placeholderImages } from '@/lib/placeholder-images';

const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ElementType;
}) => (
  <div className="flex items-start gap-4">
    {Icon && (
      <div className="bg-muted/50 rounded-full p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
    )}
    <div className="grid gap-0.5">
      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
        {label}
      </p>
      <p className="font-semibold text-foreground break-words">{value || '-'}</p>
    </div>
  </div>
);

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'KES' }).format(value);


export default function AmbulanceDetailsClient({ initialAmbulance, initialTransactions }: { initialAmbulance: Ambulance, initialTransactions: Transaction[] }) {
  const { toast } = useToast();
  const ambulanceImage = placeholderImages.find(p => p.id === 'ambulance-image');

  const [ambulance] = useState<Ambulance>(initialAmbulance);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);

  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionFormData, setTransactionFormData] = useState({
      date: new Date().toISOString().split('T')[0],
      total_till: '',
      fuel: String(ambulance.fuel_cost),
      operation: String(ambulance.operation_cost),
      police: '',
      cash_deposited_by_staff: '',
  });

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mocking adding a transaction
    setTimeout(() => {
        const newTransaction: Partial<Transaction> = {
            id: Math.random(),
            date: transactionFormData.date,
            ambulance: ambulance,
            // Mock driver and staff as they are removed from the form
            driver: {id: 1, first_name: 'Mock', last_name: 'Driver'},
            medical_staff: {id: 1, first_name: 'Mock', last_name: 'Staff'},
            total_till: Number(transactionFormData.total_till),
            target: ambulance.target,
            fuel: Number(transactionFormData.fuel),
            operation: Number(transactionFormData.operation),
            police: Number(transactionFormData.police),
            cash_deposited_by_staff: Number(transactionFormData.cash_deposited_by_staff),
        };

        // This is simplified. In a real app, all calculated fields would be computed.
        const fullTransaction = {
            ...newTransaction,
            operations_cost: newTransaction.fuel! + newTransaction.operation! + newTransaction.police!,
            amount_paid_to_the_till: 0,
            offload: 0,
            salary: 0,
            net_banked: 0,
            deficit: 0,
            performance: newTransaction.total_till! / newTransaction.target!,
            fuel_revenue_ratio: 0,
        } as Transaction;

        setTransactions([fullTransaction, ...transactions]);
        setIsSubmitting(false);
        setIsTransactionModalOpen(false);
        toast({
            title: 'Success',
            description: 'Transaction added successfully.'
        });
        // Reset form
        setTransactionFormData({
            date: new Date().toISOString().split('T')[0],
            total_till: '',
            fuel: String(ambulance.fuel_cost),
            operation: String(ambulance.operation_cost),
            police: '',
            cash_deposited_by_staff: '',
        });
    }, 500);
  };
  
  const transactionColumns = getColumns();

  const CustomToolbarActions = (
     <Dialog open={isTransactionModalOpen} onOpenChange={setIsTransactionModalOpen}>
      <DialogTrigger asChild>
         <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Transaction for {ambulance.reg_no}</DialogTitle>
          <CardDescription>
            Fill in the form below to log a new financial record for this ambulance.
          </CardDescription>
        </DialogHeader>
        <form onSubmit={handleAddTransaction}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="space-y-2">
                    <Label htmlFor="date">Transaction Date</Label>
                    <Input id="date" type="date" value={transactionFormData.date} onChange={(e) => setTransactionFormData({...transactionFormData, date: e.target.value})} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="total_till">Total Till (KES)</Label>
                  <Input id="total_till" type="number" value={transactionFormData.total_till} onChange={(e) => setTransactionFormData({...transactionFormData, total_till: e.target.value})} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="fuel">Fuel Cost (KES)</Label>
                  <Input id="fuel" type="number" value={transactionFormData.fuel} onChange={(e) => setTransactionFormData({...transactionFormData, fuel: e.target.value})} required />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="operation">Operation Cost (KES)</Label>
                  <Input id="operation" type="number" value={transactionFormData.operation} onChange={(e) => setTransactionFormData({...transactionFormData, operation: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="police">Police Payments (KES)</Label>
                  <Input id="police" type="number" value={transactionFormData.police} onChange={(e) => setTransactionFormData({...transactionFormData, police: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cash_deposited_by_staff">Cash Deposited (KES)</Label>
                  <Input id="cash_deposited_by_staff" type="number" value={transactionFormData.cash_deposited_by_staff} onChange={(e) => setTransactionFormData({...transactionFormData, cash_deposited_by_staff: e.target.value})} required />
                </div>
            </div>
            <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline"><XCircle className="mr-2 h-4 w-4" />Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  {isSubmitting ? 'Saving...' : 'Save Transaction'}
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="icon">
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to Dashboard</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight">{ambulance.reg_no}</h1>
              <p className="text-muted-foreground">
                Ambulance Financial Dashboard
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
                {ambulanceImage && (
                    <div className="relative">
                        <Image
                            src={ambulanceImage.imageUrl}
                            alt={ambulanceImage.description}
                            data-ai-hint={ambulanceImage.imageHint}
                            width={600}
                            height={400}
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                    </div>
                )}
              <CardHeader>
                  <CardTitle className="text-2xl">{ambulance.reg_no}</CardTitle>
                  <CardDescription>Ambulance Details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <DetailItem
                    icon={DollarSign}
                    label="Daily Target"
                    value={formatCurrency(ambulance.target)}
                  />
                  <DetailItem 
                    icon={Fuel} 
                    label="Default Fuel Cost" 
                    value={formatCurrency(ambulance.fuel_cost)} 
                  />
                  <DetailItem 
                    icon={Wrench} 
                    label="Default Operation Cost" 
                    value={formatCurrency(ambulance.operation_cost)}
                  />
                   <DetailItem 
                    icon={User} 
                    label="Last Driven By" 
                    value={ambulance.last_driven_by}
                  />
                   <DetailItem 
                    icon={CalendarDays} 
                    label="Last Driven On" 
                    value={ambulance.last_driven_on}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  A list of all financial records for this ambulance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable 
                    columns={transactionColumns}
                    data={transactions}
                    customActions={CustomToolbarActions}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}
