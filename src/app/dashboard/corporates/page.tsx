import { fetchCorporates } from '@/lib/data';
import CorporatesClient from './corporates-client';
import { Card, CardContent } from '@/components/ui/card';

export default async function CorporatesPage() {
  const corporates = await fetchCorporates();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
            <div className="flex items-center justify-between">
                <div>
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                    Manage Corporates
                </h1>
                <p className="text-muted-foreground">
                    A list of all corporate partners in the system.
                </p>
                </div>
            </div>
            <CorporatesClient initialCorporates={corporates} />
        </div>
      </CardContent>
    </Card>
  )
}
