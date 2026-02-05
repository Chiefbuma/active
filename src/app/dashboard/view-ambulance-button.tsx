'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { DollarSign, Loader2 } from 'lucide-react';

export function TransactButton({ ambulanceId }: { ambulanceId: number }) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleClick = () => {
        setIsLoading(true);
        router.push(`/dashboard/ambulance/${ambulanceId}`);
    };

    return (
        <Button onClick={handleClick} disabled={isLoading} size="sm">
            {isLoading ? (
                <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <DollarSign className="h-4 w-4 mr-2" /> Transact
                </>
            )}
        </Button>
    );
}
