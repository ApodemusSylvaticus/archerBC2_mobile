import React, { PropsWithChildren } from 'react';
import { Modal, ScrollView } from 'react-native';
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
    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container>
                <GoBackButton onPress={backButtonHandler}>
                    <GoBackButtonText style={{ color: 'white' }}>Go back</GoBackButtonText>
                </GoBackButton>

                <ScrollView>
                    <ContentContainer>{children}</ContentContainer>
                </ScrollView>
            </Container>
        </Modal>
    );
};
