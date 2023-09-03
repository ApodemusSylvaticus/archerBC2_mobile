import React from 'react';
import { Modal } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Container, ContentContainer, GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { DraggebleDistanceList } from '@/components/draggebleDistanceList';
import { useModalControllerStore } from '@/store/useModalControllerStore';

export const DraggebleDistanceListModal: React.FC = () => {
    const { t } = useTranslation();
    const { isDistanceListOpen, closeDistanceList, distanceListData } = useModalControllerStore(state => ({
        isDistanceListOpen: state.isDistanceListOpen,
        closeDistanceList: state.closeDistanceList,
        distanceListData: state.distanceListData,
    }));
    return (
        <Modal animationType="slide" visible={isDistanceListOpen}>
            <Container>
                <GoBackButton onPress={closeDistanceList}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>

                <ContentContainer>
                    <DraggebleDistanceList
                        distances={distanceListData.distances}
                        cZeroDistanceIdx={distanceListData.cZeroDistanceIdx}
                    />
                </ContentContainer>
            </Container>
        </Modal>
    );
};
