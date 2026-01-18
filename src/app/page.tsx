import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function LoginPage() {
  const loginImage = placeholderImages.find(p => p.id === 'login-hero');
  
  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-4 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold font-headline">Taria Health Compass</h1>
            </div>
            <h2 className="text-2xl font-semibold">Welcome Back</h2>
            <p className="text-balance text-muted-foreground">
              Enter your credentials to access your dashboard.
            </p>
          </div>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  defaultValue="patient@taria.health"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input id="password" type="password" required defaultValue="password123" />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Login</Link>
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block relative">
        {loginImage && (
          <Image
            src={loginImage.imageUrl}
            alt={loginImage.description}
            data-ai-hint={loginImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-primary/20" />
      </div>
    </div>
  );
}
