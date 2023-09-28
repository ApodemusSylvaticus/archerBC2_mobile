import React, { PropsWithChildren } from 'react';
import { Modal } from 'react-native';
import { Container } from '@/components/modals/alertModal/style';

interface AlertModalProps extends PropsWithChildren {
    closeHandler: () => void;
    isOpen: boolean;
}

export const AlertModalContainer: React.FC<AlertModalProps> = ({ children, closeHandler, isOpen }) => {
    return (
        <Modal transparent visible={isOpen} animationType="fade">
            <Container onPress={closeHandler}>{children}</Container>
        </Modal>
    );
};
