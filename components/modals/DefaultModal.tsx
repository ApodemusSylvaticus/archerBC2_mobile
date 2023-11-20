import React, { PropsWithChildren } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Container,
    ContentContainer,
    GoBackButton,
    GoBackButtonText,
    HeaderModalBase,
} from '@/components/modals/style';

export interface DefaultModalProps {
    isVisible: boolean;
}

export const ModalHeader: React.FC<PropsWithChildren> = ({ children }) => {
    const { top } = useSafeAreaInsets();

    return <HeaderModalBase topM={top}>{children}</HeaderModalBase>;
};

export const DefaultModal: React.FC<PropsWithChildren<DefaultModalProps>> = ({ isVisible, children }) => {
    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container>{children}</Container>
        </Modal>
    );
};

export interface DefaultModalWithBackBtnProps extends DefaultModalProps {
    backButtonHandler: () => void;
}
export const DefaultModalWithBackBtn: React.FC<PropsWithChildren<DefaultModalWithBackBtnProps>> = ({
    isVisible,
    backButtonHandler,
    children,
}) => {
    const { t } = useTranslation();

    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container>
                <ModalHeader>
                    <GoBackButton onPress={backButtonHandler}>
                        <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                    </GoBackButton>
                </ModalHeader>

                <ScrollView>
                    <ContentContainer>{children}</ContentContainer>
                </ScrollView>
            </Container>
        </Modal>
    );
};
