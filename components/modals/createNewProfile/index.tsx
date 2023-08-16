import React, { useEffect, useState } from 'react';
import { Modal, ScrollView } from 'react-native';
import {
    Container,
    ContentContainer,
    GoBackButton,
    GoBackButtonText,
} from '@/components/modals/createNewProfile/style';
import { DescriptionForm } from '@/components/forms/descriptionForm';
import { RiffleForm } from '@/components/forms/riffleForm';
import { CartridgeForm } from '@/components/forms/cartridgeForm';
import { BulletForm } from '@/components/forms/bulletForm';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { BallisticProfileForm } from '@/components/forms/ballisticProfileForm';
import { CoefficientForm } from '@/components/forms/coefficientForm';
import { useConvertProfile } from '@/hooks/useConvertProfile';
import { useNewProfileStore } from '@/store/useNewProfileStore';

export const CreateNewProfileModal: React.FC = () => {
    const [page, setPage] = useState<number>(0);
    const [isFinished, setIsFinished] = useState<boolean>(false);
    const convertProfile = useConvertProfile();
    const { isNewProfileOpen, closeNewProfileModal } = useModalControllerStore(state => ({
        isNewProfileOpen: state.isNewProfileOpen,
        closeNewProfileModal: state.closeNewProfileModal,
    }));
    const reset = useNewProfileStore(state => state.reset);

    const [shouldClose, setShouldClose] = useState(false);

    const goBack = () => setPage(prevState => (prevState !== 0 ? prevState - 1 : prevState));
    const goForward = async () => {
        if (page === 5) {
            setIsFinished(true);
            return;
        }
        setPage(prevState => prevState + 1);
    };

    useEffect(() => {
        if (isFinished) {
            convertProfile();
            setIsFinished(false);
            setShouldClose(true);
        }
    }, [convertProfile, isFinished]);

    useEffect(() => {
        if (shouldClose) {
            setShouldClose(false);
            reset();
            setPage(0);
            closeNewProfileModal();
        }
    }, [reset, closeNewProfileModal, shouldClose]);

    return (
        <Modal animationType="slide" visible={isNewProfileOpen}>
            <Container>
                <GoBackButton onPress={() => setShouldClose(true)}>
                    <GoBackButtonText style={{ color: 'white' }}>Go back</GoBackButtonText>
                </GoBackButton>

                <ScrollView>
                    <ContentContainer>
                        {page === 0 && <DescriptionForm goBack={goBack} goForward={goForward} />}
                        {page === 1 && <RiffleForm goBack={goBack} goForward={goForward} />}
                        {page === 2 && <CartridgeForm goBack={goBack} goForward={goForward} />}
                        {page === 3 && <BulletForm goBack={goBack} goForward={goForward} />}
                        {page === 4 && <BallisticProfileForm goBack={goBack} goForward={goForward} />}
                        {page === 5 && <CoefficientForm goBack={goBack} goForward={goForward} />}
                    </ContentContainer>
                </ScrollView>
            </Container>
        </Modal>
    );
};
