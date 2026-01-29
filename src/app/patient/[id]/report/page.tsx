'use client';

import { useEffect } from 'react';
import { notFound } from 'next/navigation';
import { mockData } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Printer, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Report from '@/components/report';

export default function ReportPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const patientId = parseInt(params.id, 10);
  const patient = mockData.patients.find((p) => p.id === patientId);

  // Auto-trigger print dialog on load for a better user experience
  useEffect(() => {
    const timer = setTimeout(() => {
      window.print();
    }, 500); // Small delay to ensure all content is rendered
    return () => clearTimeout(timer);
  }, []);

  if (!patient) {
    notFound();
  }

  const corporate = patient.corporate_id
    ? mockData.corporates.find((c) => c.id === patient.corporate_id)
    : null;

  const handleEmail = () => {
    toast({
      title: 'Email Functionality',
      description:
        'Emailing reports requires backend integration and is not yet implemented.',
    });
  };

  return (
    <div className="report-container">
      <div className="no-print p-4 bg-gray-100 flex justify-end gap-2 sticky top-0 z-50">
        <Button onClick={handleEmail} variant="outline">
          <Mail className="mr-2 h-4 w-4" />
          Email Report
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          Print to PDF
        </Button>
      </div>
      <Report patient={patient} corporate={corporate} />
    </div>
  );
}
