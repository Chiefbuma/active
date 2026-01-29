import { fetchCorporates } from '@/lib/data';
import CorporatesClient from './corporates-client';

export default async function CorporatesPage() {
  const corporates = await fetchCorporates();

  return <CorporatesClient initialCorporates={corporates} />;
}
