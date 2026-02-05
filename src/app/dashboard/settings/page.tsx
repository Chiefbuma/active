import SettingsClient from './settings-client';
import { Card, CardContent } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <Card>
      <CardContent className="pt-6">
        <SettingsClient />
      </CardContent>
    </Card>
  )
}
