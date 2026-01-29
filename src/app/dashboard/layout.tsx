import type React from 'react';
import Header from '@/components/header';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, Building } from 'lucide-react';
import { placeholderImages } from '@/lib/placeholder-images';
import type { User } from '@/lib/types';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const loggedInUser: User = {
    id: 1,
    name: 'Dr. Emily Carter',
    email: 'emily.carter@taria.health',
    role: 'physician',
    avatarUrl: placeholderImages.find(p => p.id === 'user-avatar')?.imageUrl || '',
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-8 w-8 text-primary" />
            <span className="hidden font-bold font-headline text-foreground sm:inline-block">
              Taria Health
            </span>
          </Link>
          <div className="flex items-center gap-4">
             <Button asChild>
                <Link href="/register">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Register Patient
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/dashboard/corporates">
                  <Building className="mr-2 h-4 w-4" />
                  Manage Corporates
                </Link>
              </Button>
            <Header user={loggedInUser} />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
            {children}
        </div>
      </main>
    </div>
  );
}
