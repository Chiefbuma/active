import { fetchUsers, fetchCorporates } from '@/lib/data';
import SettingsClient from './settings-client';
import { Card, CardContent } from '@/components/ui/card';

export default async function SettingsPage() {
  const users = await fetchUsers();
  const corporates = await fetchCorporates();

  return (
    <Card>
      <CardContent className="pt-6">
        <SettingsClient initialUsers={users} initialCorporates={corporates} />
      </CardContent>
    </Card>
  )
}
