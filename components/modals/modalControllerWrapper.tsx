import React, { PropsWithChildren } from 'react';
import { CreateNewProfileModal } from '@/components/modals/createNewProfile';
import { ProfileViewModal } from '@/components/modals/profileViewModal';
import { ChooseActiveProfileModal } from '@/components/modals/chooseActiveProfileModal';

export const ModalControllerWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
            <CreateNewProfileModal />
            <ProfileViewModal />
            <ChooseActiveProfileModal />
        </>
    );
};
