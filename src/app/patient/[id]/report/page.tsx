'use client';

import { useEffect } from 'react';
import { notFound, useParams } from 'next/navigation';
import { mockData } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import Report from '@/components/report';

export default function ReportPage() {
  const params = useParams();
  const { toast } = useToast();
  const patientId = parseInt(params.id as string, 10);
  const patient = mockData.patients.find((p) => p.id === patientId);

  if (!patient) {
    notFound();
  }

  const corporate = patient.corporate_id
    ? mockData.corporates.find((c) => c.id === patient.corporate_id)
    : null;

  return (
    <div className="report-container">
      <Report patient={patient} corporate={corporate} />
    </div>
  );
}
