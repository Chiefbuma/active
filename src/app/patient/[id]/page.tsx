import { fetchPatientById } from '@/lib/data';
import PatientDetails from './patient-details';
import { notFound } from 'next/navigation';

export default async function PatientPage({ params: { id } }: { params: { id: string } }) {
  const patient = await fetchPatientById(id);

  if (!patient) {
    notFound();
  }

  return <PatientDetails initialPatient={patient} />;
}
