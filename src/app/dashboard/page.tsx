"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function DashboardRedirect() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === 'system-superadmin') {
                router.push('/dashboard/superadmin');
            } else if (user.role === 'admin') {
                router.push('/dashboard/admin');
            } else if (user.role === 'franchisee') {
                router.push('/dashboard/franchise');
            }
        }
    }, [user, isLoading, router]);

    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );
}
