import React, { PropsWithChildren } from 'react';
import { Modal, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Container, ContentContainer, GoBackButton, GoBackButtonText } from '@/components/modals/style';

interface DefaultModalProps {
    isVisible: boolean;
    backButtonHandler: () => void;
}
export const DefaultModal: React.FC<PropsWithChildren<DefaultModalProps>> = ({
    isVisible,
    backButtonHandler,
    children,
}) => {
    const { t } = useTranslation();
    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container>
                <GoBackButton onPress={backButtonHandler}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>

                <ScrollView>
                    <ContentContainer>{children}</ContentContainer>
                </ScrollView>
            </Container>
        </Modal>
    );
};
