import React, { PropsWithChildren } from 'react';
import { CreateNewProfileModal } from '@/components/modals/createNewProfile';
import { ProfileViewModal } from '@/components/modals/profileViewModal';

export const ModalControllerWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
            <CreateNewProfileModal />
            <ProfileViewModal />
        </>
    );
};
