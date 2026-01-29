'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Report from '@/components/report';
import type { Patient, Corporate } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Printer, Mail, XCircle } from 'lucide-react';
import '../app/patient/[id]/report/report.css';

type ReportViewerProps = {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient;
  corporate: Corporate | null;
};

export default function ReportViewer({
  isOpen,
  onClose,
  patient,
  corporate,
}: ReportViewerProps) {
  const { toast } = useToast();

  const handlePrint = () => {
    // The CSS @media print rules in globals.css and report.css will handle the printing layout
    window.print();
  };

  const handleEmail = () => {
    toast({
      title: 'Email Functionality',
      description:
        'Emailing reports requires backend integration and is not yet implemented.',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="report-print-container max-w-5xl h-[95vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 no-print">
          <DialogTitle>Patient Wellness Report</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-hidden bg-muted/50">
          <ScrollArea className="h-full">
             <div className="py-8">
               <Report patient={patient} corporate={corporate} />
             </div>
          </ScrollArea>
        </div>
        <DialogFooter className="p-6 pt-4 bg-background/95 border-t sm:justify-between no-print">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              <XCircle className="mr-2 h-4 w-4" />
              Close
            </Button>
          </DialogClose>
          <div className="flex items-center gap-2">
            <Button onClick={handleEmail} variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email Report
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print to PDF
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
