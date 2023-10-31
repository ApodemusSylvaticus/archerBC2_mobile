import React from 'react';
import { Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { DraggableDistanceList } from '@/components/draggebleDistanceList';
import { useModalControllerStore } from '@/store/useModalControllerStore';

export const DraggableDistanceListModal: React.FC = () => {
    const { t } = useTranslation();
    const { isDistanceListOpen, closeDistanceList } = useModalControllerStore(state => ({
        isDistanceListOpen: state.isDistanceListOpen,
        closeDistanceList: state.closeDistanceList,
    }));
    const { top } = useSafeAreaInsets();
    return (
        <Modal animationType="slide" visible={isDistanceListOpen}>
            <Container>
                <GoBackButton onPress={closeDistanceList} topM={top}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>

                <DraggableDistanceList />
            </Container>
        </Modal>
    );
};

export const DraggableDistanceListModalMemo = React.memo(DraggableDistanceListModal);
