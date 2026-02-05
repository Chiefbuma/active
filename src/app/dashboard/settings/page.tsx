import SettingsClient from './settings-client';
import { Card, CardContent } from '@/components/ui/card';
import { fetchUsers } from '@/lib/data';

export default async function SettingsPage() {
  const users = await fetchUsers();
  return (
    <Card>
      <CardContent className="pt-6">
        <SettingsClient initialUsers={users} />
      </CardContent>
    </Card>
  )
}
