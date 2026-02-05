'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, Loader2 } from 'lucide-react';

export function ViewAmbulanceButton({ ambulanceId }: { ambulanceId: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        setIsLoading(true);
        router.push(`/dashboard/ambulance/${ambulanceId}`);
    };

    return (
        <Button onClick={handleClick} disabled={isLoading} size="sm" variant="outline">
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <Eye className="h-4 w-4 mr-2" />
                    View Dashboard
                </>
            )}
        </Button>
    );
}
