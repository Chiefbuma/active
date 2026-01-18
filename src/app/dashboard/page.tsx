import { healthData } from '@/lib/data';
import DashboardClient from '@/components/dashboard-client';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Welcome back, {healthData.user.name.split(' ')[0]}!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your health overview for Week {healthData.weekNumber}. Keep up the great work!
        </p>
      </div>
      <DashboardClient healthData={healthData} />
    </div>
  );
}
