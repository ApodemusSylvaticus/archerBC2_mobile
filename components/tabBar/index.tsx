import React from 'react';
import { usePathname } from 'expo-router';
import { Tab } from '@/components/tabBar/tab';
import { Container } from '@/components/tabBar/style';
import { Routing } from '@/constant/routing';

export const TabBar: React.FC = () => {
    const pathName = usePathname();
    const data = [
        {
            name: 'Curr Profile',
            to: Routing.CURRENT_PROFILE,
        },
        {
            name: 'Envi',
            to: Routing.ENVI,
        },
        {
            name: 'Profiles',
            to: Routing.PROFILES,
        },
        {
            name: 'Reticles',
            to: Routing.RETICLES,
        },
        {
            name: 'Setting',
            to: Routing.SETTING,
        },
    ];

    return (
        <Container>
            {data.map(({ name, to }) => (
                <Tab isActive={pathName === to} key={name} href={to}>
                    {name}
                </Tab>
            ))}
        </Container>
    );
};
