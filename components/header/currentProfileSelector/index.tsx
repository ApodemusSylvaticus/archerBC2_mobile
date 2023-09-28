import React from 'react';
import { Text20 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { Button } from '@/components/header/currentProfileSelector/style';

export const CurrentProfileSelector: React.FC = () => {
    const { openChooseActiveProfileModal } = useModalControllerStore(state => ({
        openChooseActiveProfileModal: state.openChooseActiveProfileModal,
    }));

    return (
        <Button onPress={openChooseActiveProfileModal}>
            <Text20>Choose another profile</Text20>
        </Button>
    );
};
