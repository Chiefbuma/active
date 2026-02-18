import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const ProfileClient = dynamic(
  () => import('./profile-client'),
  {
    ssr: false,
    loading: () => <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
  }
);

export default function ProfilePage() {
  return <ProfileClient />;
}
