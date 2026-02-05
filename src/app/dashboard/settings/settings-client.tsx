'use client';

import UsersClient from '@/app/dashboard/users/users-client';

export default function SettingsClient() {

  return (
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
  );
}
