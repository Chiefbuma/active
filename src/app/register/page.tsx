import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function RegisterPage() {
  return (
    <div className="flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>New Patient Registration</CardTitle>
          <CardDescription>
            Fill in the form below to register a new patient for the campaign.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid gap-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="middle-name">Middle Name (Optional)</Label>
                <Input id="middle-name" placeholder="Fitzgerald" />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="surname">Surname</Label>
                <Input id="surname" placeholder="Doe" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input id="dob" type="date" required />
              </div>
               <div className="grid gap-2">
                <Label htmlFor="sex">Sex</Label>
                <Select>
                  <SelectTrigger id="sex">
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+254 712 345 678" required />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
               <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="corporate">Corporate (Optional)</Label>
                 <Select>
                  <SelectTrigger id="corporate">
                    <SelectValue placeholder="Select corporate" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Bio Food Products</SelectItem>
                    <SelectItem value="2">Ikomoko</SelectItem>
                    <SelectItem value="3">Taria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
               <Button variant="outline" asChild>
                <Link href="/dashboard">Cancel</Link>
              </Button>
              <Button type="submit">Register Patient</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
