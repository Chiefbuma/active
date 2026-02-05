import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardClient from './dashboard-client';
import { getTransactions } from '@/lib/data';

export default async function DashboardPage() {
  const transactions = await getTransactions();
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Ambulance Revenue
        </h1>
        <p className="text-muted-foreground">
          Overview of daily financial transactions for your fleet.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            A list of all financial records logged in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardClient initialTransactions={transactions} />
        </CardContent>
      </Card>
    </div>
  );
}
