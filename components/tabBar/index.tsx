import React from 'react';
import { usePathname } from 'expo-router';
import { useTheme } from 'styled-components/native';
import { Tab } from '@/components/tabBar/tab';
import { Container } from '@/components/tabBar/style';
import { Routing } from '@/constant/routing';
import { EnviSVG } from '@/components/svg/envi';
import { CurrentProfileSVG } from '@/components/svg/currentProfile';
import { ReticlesSVG } from '@/components/svg/reticles';
import { ProfilesSVG } from '@/components/svg/profiles';
import { SettingSVG } from '@/components/svg/setting';

export const TabBar: React.FC = () => {
    const pathName = usePathname();
    const { colors } = useTheme();

    const data = [
        {
            svg: (
                <CurrentProfileSVG
                    height={30}
                    width={30}
                    fillColor={pathName === Routing.CURRENT_PROFILE ? colors.activeTab : colors.appBg}
                />
            ),
            to: Routing.CURRENT_PROFILE,
        },
        {
            svg: (
                <EnviSVG
                    height={30}
                    width={30}
                    fillColor={pathName === Routing.SHOT_CONDITIONS ? colors.activeTab : colors.appBg}
                />
            ),
            to: Routing.SHOT_CONDITIONS,
        },
        {
            svg: (
                <ProfilesSVG
                    height={30}
                    width={35}
                    fillColor={pathName === Routing.PROFILES ? colors.activeTab : colors.appBg}
                />
            ),
            to: Routing.PROFILES,
        },
        {
            svg: (
                <ReticlesSVG
                    height={30}
                    width={45}
                    fillColor={pathName === Routing.RETICLES ? colors.activeTab : colors.appBg}
                />
            ),
            to: Routing.RETICLES,
        },
        {
            svg: (
                <SettingSVG
                    height={30}
                    width={30}
                    fillColor={pathName === Routing.SETTING ? colors.activeTab : colors.appBg}
                />
            ),
            to: Routing.SETTING,
        },
    ];

    return (
        <Container>
            {data.map(({ svg, to }) => (
                <Tab isActive={pathName === to} key={to} href={to}>
                    {svg}
                </Tab>
            ))}
        </Container>
    );
};
