'use client';

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Layout from '../../layout/layout';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

interface MainLayoutProps {
    children: React.ReactNode;
}

const PUBLIC_PATHS = ['/login'];

export default function MainLayout({ children }: MainLayoutProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
    const isPublicPath = PUBLIC_PATHS.includes(pathname);

    useEffect(() => {
        let mounted = true;

        const handleAuth = () => {
            if (!mounted) return;

            if (!isAuthenticated && !user && !isPublicPath) {
                router.push('/login');
            } 
        };

        handleAuth();

        return () => {
            mounted = false;
        };
    }, [isAuthenticated, user, isPublicPath, router, pathname]);

    if (isPublicPath) {
        return <>{children}</>;
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    return <Layout>{children}</Layout>;
}