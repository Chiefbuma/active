import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the admin dashboard for testing purposes
  redirect('/dashboard/admin');
}
