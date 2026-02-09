'use client';

import type React from 'react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Loader2, Truck, LayoutDashboard, User, Users, UsersRound } from 'lucide-react';
import type { User as AppUser } from '@/lib/types';
import Logo from '@/components/logo';
import { Separator } from '@/components/ui/separator';

const mainNavLinks = [
  { href: '/dashboard/ambulances', label: 'Ambulances', icon: Truck, admin: false },
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard, admin: true },
]

const personnelNavLinks = [
  { href: '/dashboard/drivers', label: 'Drivers', icon: User, admin: true },
  { href: '/dashboard/medical-staff', label: 'Technicians', icon: Users, admin: true },
  { href: '/dashboard/users', label: 'App Users', icon: UsersRound, admin: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
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

  const renderNavLinks = (links: typeof mainNavLinks) => {
    return links.map(link => {
        if (link.admin && user.role !== 'admin') return null;
        const isActive = pathname.startsWith(link.href);
        return (
           <Button key={link.href} asChild variant={isActive ? 'secondary' : 'ghost'} size="sm">
              <Link href={link.href}>
                <link.icon className="mr-0 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
          </Button>
        )
     })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
             {renderNavLinks(mainNavLinks)}
             
             {user.role === 'admin' && (
                <>
                    <Separator orientation="vertical" className="h-6 mx-2 hidden sm:block" />
                    {renderNavLinks(personnelNavLinks)}
                </>
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
