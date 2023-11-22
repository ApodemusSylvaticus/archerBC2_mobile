import React from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import { DefaultModal, ModalHeader } from '@/components/modals/DefaultModal';
import { IDraggableListItem, useModalControllerStore } from '@/store/useModalControllerStore';
import { Profile } from '@/components/profile';
import { useProfileStore } from '@/store/useProfileStore';
import { WithFileName } from '@/interface/helper';
import { IDescription } from '@/interface/profile';
import { DraggableDistanceListModalMemo } from '@/components/modals/draggebleDistanceList';
import { ShareButton } from '@/components/button/shareButton';
import { DeleteButtonWithConfirm } from '@/components/button/deleteButtonWithConfirm';
import { ContentContainer, GoBackButton, GoBackButtonText } from '@/components/modals/style';

export const ProfileViewModal: React.FC = () => {
    const { profileViewModalFileName, isProfileViewModalOpen, closeProfileViewModal, setProfileViewModalFileName } =
        useModalControllerStore(state => ({
            profileViewModalFileName: state.profileViewModalFileName,
            isProfileViewModalOpen: state.isProfileViewModalOpen,
            closeProfileViewModal: state.closeProfileViewModal,
            setProfileViewModalFileName: state.setProfileViewModalFileName,
        }));
    const { t } = useTranslation();
    const deleteProfile = useProfileStore(state => state.deleteProfile);

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
        return;
    }

    const handleSetDescription = (data: WithFileName<IDescription & { prevFileName: string }>) => {
        setDescription(data);
        setProfileViewModalFileName(data.fileName);
    };

    const profile = profiles.find(el => el.fileName === profileViewModalFileName);

    if (!profile) {
        throw new Error('Profile not found');
    }

    const deleteConfirm = async () => {
        deleteProfile(profile!.fileName);
        closeProfileViewModal();
    };

    const handleSetDistances = (data: IDraggableListItem[]) => {
        setDistances({ fileName: profile.fileName, data });
    };
    // eslint-disable-next-line consistent-return
    return (
        <DefaultModal isVisible={isProfileViewModalOpen}>
            <ModalHeader>
                <GoBackButton onPress={closeProfileViewModal}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>
                <ShareButton {...profile} />
            </ModalHeader>

            <ScrollView>
                <ContentContainer>
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

                    <DeleteButtonWithConfirm
                        buttonText={t('profile_delete_profile')}
                        confirmHandler={deleteConfirm}
                        confirmMsg={t('profile_are_you_sure_delete')}
                    />
                </ContentContainer>
            </ScrollView>
        </DefaultModal>
    );
};
