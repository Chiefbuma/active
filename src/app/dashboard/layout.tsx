'use client';

import type React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Truck, LayoutDashboard, Settings, Loader2 } from 'lucide-react';
import type { User as AppUser } from '@/lib/types';
import Logo from '@/components/logo';

const navLinks = [
  { href: '/dashboard/admin', label: 'Admin Dashboard', icon: LayoutDashboard, admin: true },
  { href: '/dashboard/ambulances', label: 'Ambulances', icon: Truck, admin: false },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings, admin: true },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
        localStorage.removeItem('loggedInUser');
        router.replace('/');
      }
    } else {
      router.replace('/'); // Redirect to login if no user
    }
    setLoading(false);
  }, [router]);


  const renderNavLinks = (links: typeof navLinks) => {
    return links.map(link => {
        if (!user || (link.admin && user.role !== 'admin')) return null;
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
            <Logo className="h-8 w-auto" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
             {renderNavLinks(navLinks)}
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
