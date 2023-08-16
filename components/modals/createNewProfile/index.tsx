import React, { useState } from 'react';
import { Modal } from 'react-native';
import { Container } from '@/components/modals/createNewProfile/style';
import { DescriptionForm } from '@/components/forms/descriptionForm';
import { RiffleForm } from '@/components/forms/riffleForm';
import { CartridgeForm } from '@/components/forms/cartridgeForm';
import { BulletForm } from '@/components/forms/bulletForm';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { BallisticProfileForm } from '@/components/forms/ballisticProfileForm';
import { CoefficientForm } from '@/components/forms/coefficientForm';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { useConvertProfile } from '@/hooks/useConvertProfile';
import { useProfileStore } from '@/store/useProfileStore';
import { calculateProfileHash } from '@/helpers/hashFunc';

export const CreateNewProfileModal: React.FC = () => {
    const [page, setPage] = useState<number>(0);
    const { reset } = useNewProfileStore(state => ({ reset: state.reset }));
    const addNewProfile = useProfileStore(state => state.addNewProfile);
    const convertProfile = useConvertProfile();
    const { isNewProfileOpen, closeNewProfileModal } = useModalControllerStore(state => ({
        isNewProfileOpen: state.isNewProfileOpen,
        closeNewProfileModal: state.closeNewProfileModal,
    }));

    const goBack = () => setPage(prevState => (prevState !== 0 ? prevState - 1 : prevState));
    const goForward = async () =>
        setPage(prevState => {
            if (prevState !== 5) {
                return prevState + 1;
            }
            const profile = convertProfile();
            calculateProfileHash(profile);
            addNewProfile({ ...profile, id: calculateProfileHash(profile) });
            console.log('newProfile', { ...profile, id: calculateProfileHash(profile) });
            closeNewProfileModal();
            reset();

            return 0;
        });

    return (
        <Modal animationType="slide" visible={isNewProfileOpen}>
            <DefaultButton onPress={closeNewProfileModal}>
                <Text20 style={{ color: 'white' }}>Go back</Text20>
            </DefaultButton>
            <Container>
                {page === 0 && <DescriptionForm goBack={goBack} goForward={goForward} />}
                {page === 1 && <RiffleForm goBack={goBack} goForward={goForward} />}
                {page === 2 && <CartridgeForm goBack={goBack} goForward={goForward} />}
                {page === 3 && <BulletForm goBack={goBack} goForward={goForward} />}
                {page === 4 && <BallisticProfileForm goBack={goBack} goForward={goForward} />}
                {page === 5 && <CoefficientForm goBack={goBack} goForward={goForward} />}
            </Container>
        </Modal>
    );
};
