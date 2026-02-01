'use client';

import type { User, Corporate } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UsersClient from '@/app/dashboard/users/users-client';
import CorporatesClient from '@/app/dashboard/corporates/corporates-client';

export default function SettingsClient({ initialUsers, initialCorporates }: { initialUsers: User[], initialCorporates: Corporate[] }) {

  return (
    <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
            <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
                Settings
            </h1>
            <p className="text-muted-foreground">
                Manage system-wide users and corporate partners.
            </p>
            </div>
        </div>
        <Tabs defaultValue="users" className="w-full">
            <TabsList>
                <TabsTrigger value="users">Manage Users</TabsTrigger>
                <TabsTrigger value="corporates">Manage Corporates</TabsTrigger>
            </TabsList>
            <TabsContent value="users" className="pt-4">
                <UsersClient initialUsers={initialUsers} />
            </TabsContent>
            <TabsContent value="corporates" className="pt-4">
                <CorporatesClient initialCorporates={initialCorporates} />
            </TabsContent>
        </Tabs>
    </div>
  );
}
