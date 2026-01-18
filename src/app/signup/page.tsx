import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Logo from '@/components/logo';
import Image from 'next/image';
import { placeholderImages } from '@/lib/placeholder-images';

export default function SignupPage() {
  const signupImage = placeholderImages.find(p => p.id === 'signup-hero');

  return (
    <div className="w-full min-h-screen lg:grid lg:grid-cols-2">
      <div className="hidden bg-muted lg:block relative">
        {signupImage && (
          <Image
            src={signupImage.imageUrl}
            alt={signupImage.description}
            data-ai-hint={signupImage.imageHint}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-primary/20" />
      </div>
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-md gap-6">
          <div className="grid gap-4 text-center">
            <div className="flex justify-center items-center gap-4 mb-4">
              <Logo className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold font-headline">Taria Health Compass</h1>
            </div>
            <h2 className="text-2xl font-semibold">Create an Account</h2>
            <p className="text-balance text-muted-foreground">
              Start your journey to better health today.
            </p>
          </div>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">Full Name</Label>
                <Input id="full-name" placeholder="Jane Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full" asChild>
                <Link href="/dashboard">Create Account</Link>
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
