import { Redirect } from 'expo-router';
import React from 'react';
import { Routing } from '@/constant/routing';

export default function Home() {
    return <Redirect href={Routing.PROFILES} />;
}
