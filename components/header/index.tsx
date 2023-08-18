import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import {
    ButtonText,
    Container,
    FirstButton,
    Line,
    SecondButton,
    ThirdButton,
    TripleButtonContainer,
} from '@/components/header/style';
import { Routing } from '@/constant/routing';
import { useModalControllerStore } from '@/store/useModalControllerStore';

export const Header: React.FC = () => {
    const { top, left, right } = useSafeAreaInsets();
    const pathname = usePathname();
    const openNewProfileModal = useModalControllerStore(state => state.openNewProfileModal);

    switch (pathname) {
        case Routing.PROFILES:
            return (
                <Container top={top} left={left} right={right}>
                    <TripleButtonContainer>
                        <FirstButton onPress={openNewProfileModal}>
                            <ButtonText>Create new</ButtonText>
                        </FirstButton>

                        <Line />

                        <SecondButton>
                            <ButtonText>Send selected</ButtonText>
                        </SecondButton>

                        <Line />

                        <ThirdButton>
                            <ButtonText>Import</ButtonText>
                        </ThirdButton>
                    </TripleButtonContainer>
                </Container>
            );
        case Routing.ENVI:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
        case Routing.SETTING:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
        case Routing.RETICLES:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
        case Routing.CURRENT_PROFILE:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
        default:
            // eslint-disable-next-line react/jsx-no-useless-fragment
            return <></>;
    }
};
