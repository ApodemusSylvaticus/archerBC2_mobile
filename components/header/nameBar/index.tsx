import React, { PropsWithChildren, useMemo } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Container, LeftCrunch, NameBarContainer, RightCrunch } from '@/components/header/nameBar/style';
import { TextSemiBold24 } from '@/components/text/styled';
import { Routing } from '@/constant/routing';

export const NameBar: React.FC<PropsWithChildren> = ({ children }) => {
    const { t } = useTranslation();
    const { top } = useSafeAreaInsets();
    const pathname = usePathname();

    const name = useMemo(() => {
        switch (pathname) {
            case Routing.PROFILES:
                return t('default_profiles');
            case Routing.SHOT_CONDITIONS:
                return t('default_shot_conditions');
            case Routing.SETTING:
                return t('default_setting');
            case Routing.RETICLES:
                return t('default_reticles');
            case Routing.CURRENT_PROFILE:
                return t('default_current_profile');
            default:
                return 'Empty';
        }
    }, [t, pathname]);

    return (
        <Container top={top}>
            <NameBarContainer
                style={{
                    borderBottomWidth: 2,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderLeftColor: 'rgb(33, 33, 33)',
                    borderRightColor: 'rgb(33, 33, 33)',
                    borderRadius: 16,
                }}>
                <LeftCrunch />
                <RightCrunch />
                <TextSemiBold24>{name}</TextSemiBold24>
            </NameBarContainer>
            {children}
        </Container>
    );
};
