import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container, GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { DraggableDistanceList } from '@/components/draggebleDistanceList';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { DefaultModal, ModalHeader } from '@/components/modals/DefaultModal';

export const DraggableDistanceListModal: React.FC = () => {
    const { t } = useTranslation();
    const { isDistanceListOpen, closeDistanceList } = useModalControllerStore(state => ({
        isDistanceListOpen: state.isDistanceListOpen,
        closeDistanceList: state.closeDistanceList,
    }));
    return (
        <DefaultModal isVisible={isDistanceListOpen}>
            <Container>
                <ModalHeader>
                    <GoBackButton onPress={closeDistanceList}>
                        <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                    </GoBackButton>
                </ModalHeader>

                <DraggableDistanceList />
            </Container>
        </DefaultModal>
    );
};

export const DraggableDistanceListModalMemo = React.memo(DraggableDistanceListModal);
