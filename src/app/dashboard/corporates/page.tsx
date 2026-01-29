import { fetchCorporates } from '@/lib/data';
import CorporatesClient from './corporates-client';
import { Card, CardContent } from '@/components/ui/card';

export default async function CorporatesPage() {
  const corporates = await fetchCorporates();

  return (
    <Card>
      <CardContent className="pt-6">
        <CorporatesClient initialCorporates={corporates} />
      </CardContent>
    </Card>
  )
}
