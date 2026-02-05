import { getUsers, getDrivers, getMedicalStaff } from '@/lib/data';
import UsersClient from '@/app/dashboard/users/users-client';
import DriversClient from '@/app/dashboard/drivers/drivers-client';
import MedicalStaffClient from '@/app/dashboard/medical-staff/medical-staff-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default async function SettingsPage() {
  const users = await getUsers();
  const drivers = await getDrivers();
  const medicalStaff = await getMedicalStaff();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Manage your application's users and resources.
        </p>
      </div>
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">App Users</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="medical-staff">Medical Staff</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Manage App Users</CardTitle>
              <CardDescription>A list of all administrators and staff in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              <UsersClient initialUsers={users} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="drivers">
          <Card>
            <CardHeader>
              <CardTitle>Manage Drivers</CardTitle>
              <CardDescription>A list of all drivers in your fleet.</CardDescription>
            </CardHeader>
            <CardContent>
              <DriversClient initialDrivers={drivers} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="medical-staff">
          <Card>
            <CardHeader>
              <CardTitle>Manage Medical Staff</CardTitle>
              <CardDescription>A list of all medical staff in your team.</CardDescription>
            </CardHeader>
            <CardContent>
              <MedicalStaffClient initialMedicalStaff={medicalStaff} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
