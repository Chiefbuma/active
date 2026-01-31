'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { UserPlus, Building, Loader2, Users } from 'lucide-react';
import type { User } from '@/lib/types';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
       // Create a user object that matches the type, using a placeholder for avatarUrl
      const userForState: User = {
        ...parsedUser,
        avatarUrl: '', // Will be set from placeholder if available
      };
      
      const userAvatar = placeholderImages.find(p => p.id === 'user-avatar');
      if (userAvatar) {
        userForState.avatarUrl = userAvatar.imageUrl;
      }
      setUser(userForState);
    } else {
      router.push('/'); // Redirect to login if no user is found
    }
    setLoading(false);
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
              {user && user.role === 'admin' && (
                <Button asChild variant="outline">
                    <Link href="/dashboard/users">
                        <Users className="mr-2 h-4 w-4" />
                        Manage Users
                    </Link>
                </Button>
             )}
            <Header user={user} />
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

// Need to import placeholderImages to use it
import { placeholderImages } from '@/lib/placeholder-images';
