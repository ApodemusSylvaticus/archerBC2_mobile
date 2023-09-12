import { Redirect, useRootNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Routing } from '@/constant/routing';

export default function Home() {
    const [isNavigationReady, setNavigationReady] = useState(false);

    const rootNavigation = useRootNavigation();
    useEffect(() => {
        const unsubscribe = rootNavigation?.addListener('state', () => {
            setNavigationReady(true);
        });
        return function cleanup() {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [rootNavigation]);
    if (!isNavigationReady) {
        return null;
    }
    return <Redirect href={Routing.PROFILES} />;
}
