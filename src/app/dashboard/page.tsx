import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import DashboardClient from './dashboard-client';

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Campaign Dashboard
        </h1>
        <p className="text-muted-foreground">
          Overview of patient registrations for the current campaign.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
          <CardDescription>
            A list of patients registered in the campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardClient />
        </CardContent>
      </Card>
    </div>
  );
}
