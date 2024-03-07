import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20, Text20, TextSemiBold24 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileTabCard } from '@/components/profile/style';
import { Profile } from '@/interface/profile';

export const ProfileTab: React.FC<Profile> = profile => {
    const { t } = useTranslation();
    const { profileName, bulletName, cartridgeName, fileName } = profile;
    const openProfileViewModal = useModalControllerStore(store => store.openProfileViewModal);
    const { selectedProfiles, deselectProfile, selectProfile } = useProfileStore(state => ({
        selectedProfiles: state.selectedProfiles,
        selectProfile: state.selectProfile,
        deselectProfile: state.deselectProfile,
    }));
    const isSelected = !!selectedProfiles.find(el => el === fileName);

    const handlePress = () => {
        if (isSelected) {
            deselectProfile(fileName);
            return;
        }
        selectProfile(fileName);
    };

    return (
        <ProfileTabCard isSelected={isSelected}>
            <SeparateRow>
                <TextSemiBold24>{profileName}</TextSemiBold24>
                <DefaultButton onPress={handlePress}>
                    <TextSemiBold20>{isSelected ? t('default_deselect') : t('default_select')}</TextSemiBold20>
                </DefaultButton>
            </SeparateRow>
            <DefaultRow>
                <Text20>{t('profile_bullet')}</Text20>
                <Text20>{bulletName}</Text20>
            </DefaultRow>
            <DefaultRow>
                <Text20>{t('profile_cartridge')}</Text20>
                <Text20>{cartridgeName}</Text20>
            </DefaultRow>

            <DefaultButton onPress={() => openProfileViewModal(fileName)}>
                <TextSemiBold20>{t('default_more_info')}</TextSemiBold20>
            </DefaultButton>
        </ProfileTabCard>
    );
};
