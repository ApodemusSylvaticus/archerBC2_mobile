import React from 'react';
import { usePathname } from 'expo-router';
import { useTranslation } from 'react-i18next';
import {
    ButtonText,
    FirstButton,
    Line,
    SecondButton,
    ThirdButton,
    TripleButtonContainer,
} from '@/components/header/style';
import { Routing } from '@/constant/routing';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { NameBar } from '@/components/header/nameBar';
import { useProfileStore } from '@/store/useProfileStore';

export const Header: React.FC = () => {
    const pathname = usePathname();
    const { t } = useTranslation();
    const openNewProfileModal = useModalControllerStore(state => state.openNewProfileModal);
    const sendSelected = useProfileStore(state => state.sendSelected);

    switch (pathname) {
        case Routing.PROFILES:
            return (
                <NameBar>
                    <TripleButtonContainer>
                        <FirstButton onPress={openNewProfileModal}>
                            <ButtonText>{t('default_create_new')}</ButtonText>
                        </FirstButton>

                        <Line />

                        <SecondButton onPress={sendSelected}>
                            <ButtonText>{t('default_send_selected')}</ButtonText>
                        </SecondButton>

                        <Line />

                        <ThirdButton>
                            <ButtonText>{t('default_import')}</ButtonText>
                        </ThirdButton>
                    </TripleButtonContainer>
                </NameBar>
            );
        case Routing.ENVI:
            return <NameBar />;
        case Routing.SETTING:
            return <NameBar />;
        case Routing.RETICLES:
            return <NameBar />;
        case Routing.CURRENT_PROFILE:
            return <NameBar />;
        default:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
    }
};
