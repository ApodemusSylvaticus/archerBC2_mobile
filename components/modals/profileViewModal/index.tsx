import React from 'react';
import { DefaultModal } from '@/components/modals/DefaultModal';
import { IDraggableListItem, useModalControllerStore } from '@/store/useModalControllerStore';
import { Profile } from '@/components/profile';
import { useProfileStore } from '@/store/useProfileStore';
import { WithFileName } from '@/interface/helper';
import { IDescription } from '@/interface/profile';
import { DraggableDistanceListModalMemo } from '@/components/modals/draggebleDistanceList';

export const ProfileViewModal: React.FC = () => {
    const { profileViewModalFileName, isProfileViewModalOpen, closeProfileViewModal, setProfileViewModalFileName } =
        useModalControllerStore(state => ({
            profileViewModalFileName: state.profileViewModalFileName,
            isProfileViewModalOpen: state.isProfileViewModalOpen,
            closeProfileViewModal: state.closeProfileViewModal,
            setProfileViewModalFileName: state.setProfileViewModalFileName,
        }));

    const profiles = useProfileStore(state => state.profiles);

    const { setProfileRifle, setZeroing, setProfileBullet, setCartridge, setDescription, setDistances } =
        useProfileStore(state => ({
            setProfileRifle: state.setProfileRifle,
            setZeroing: state.setZeroing,
            setProfileBullet: state.setProfileBullet,
            setCartridge: state.setCartridge,
            setDescription: state.setDescription,
            setDistances: state.setDistance,
        }));

    if (profileViewModalFileName === null) {
        // TODO
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    const handleSetDescription = (data: WithFileName<IDescription & { prevFileName: string }>) => {
        setDescription(data);
        setProfileViewModalFileName(data.fileName);
    };

    const profile = profiles.find(el => el.fileName === profileViewModalFileName);

    if (!profile) {
        throw new Error('TODO ERRRO');
    }

    const handleSetDistances = (data: IDraggableListItem[]) => {
        setDistances({ fileName: profile.fileName, data });
    };
    return (
        <DefaultModal backButtonHandler={closeProfileViewModal} isVisible={isProfileViewModalOpen}>
            <Profile
                {...profile}
                isFileNameChangeable
                setDescription={handleSetDescription}
                setRiffle={setProfileRifle}
                setCartridge={setCartridge}
                setBullet={setProfileBullet}
                setZeroing={setZeroing}
                setDistances={handleSetDistances}
            />
            <DraggableDistanceListModalMemo />
        </DefaultModal>
    );
};
