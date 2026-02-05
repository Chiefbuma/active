import UsersClient from './users-client';
import { Card, CardContent } from '@/components/ui/card';

export default function UsersPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Manage Users
                </h1>
                <p className="text-muted-foreground">
                    A list of all staff members in the system.
                </p>
                </div>
            </div>
            <UsersClient />
        </div>
      </CardContent>
    </Card>
  )
}
