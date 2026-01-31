import { fetchUsers } from '@/lib/data';
import UsersClient from './users-client';
import { Card, CardContent } from '@/components/ui/card';

// We can add logic here later to restrict access to admins only
// For now, the button is hidden for non-admins

export default async function UsersPage() {
  const users = await fetchUsers();

  return (
    <Card>
      <CardContent className="pt-6">
        <UsersClient initialUsers={users} />
      </CardContent>
    </Card>
  )
}
