import React, { PropsWithChildren } from 'react';
import { CreateNewProfileModal } from '@/components/modals/createNewProfile';
import { ProfileViewModal } from '@/components/modals/profileViewModal';
import { DraggebleDistanceListModal } from '@/components/modals/draggebleDistanceList';

export const ModalControllerWrapper: React.FC<PropsWithChildren> = ({ children }) => {
    return (
        <>
            {children}
            <CreateNewProfileModal />
            <ProfileViewModal />
            <DraggebleDistanceListModal />
        </>
    );
};
