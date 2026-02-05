'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import Logo from '@/components/logo';
import { users } from '@/lib/mock-data'; 

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Mock authentication
    setTimeout(() => {
        const user = users.find(u => u.email === email);
        // In a real app, you'd also check the password hash. Here we just check for user existence and a static password.
        if (user && password === 'password') {
             // Store user info in localStorage
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            
            toast({
                title: 'Success!',
                description: 'Logged in successfully.',
            });

            router.push('/dashboard');
        } else {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Invalid credentials. Please try again.',
            });
        }
        setLoading(false);
    }, 500);
  };
  
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4 bg-background">
       <div className="w-full max-w-md">
            <div className="flex justify-center items-center mb-6">
                <Logo className="h-12 w-auto" />
            </div>
            <Card className="border">
                <CardHeader className="text-center">
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Enter your credentials to access the dashboard.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            />
                        </div>
                        <div className="grid gap-2 relative">
                            <div className="flex items-center">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot password?
                            </Link>
                            </div>
                            <Input 
                            id="password" 
                            type={showPassword ? 'text' : 'password'} 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute bottom-1 right-1 h-7 w-7"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={loading}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword ? 'Hide password' : 'Show password'}
                              </span>
                            </Button>
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Login'}
                        </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
