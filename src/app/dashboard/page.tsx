import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // The main dashboard is now the ambulances list.
  // Redirect to that page to provide a default view.
  redirect('/dashboard/admin');
}
