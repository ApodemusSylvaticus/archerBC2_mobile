import React from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { DefaultButton } from '@/components/button/style';
import { ButtonTextBold18, Text20, TextSemiBold24 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileTabCard } from '@/components/profile/style';

export interface IProfileTab {
    profileName: string;
    bullet: string;
    cartridge: string;
    id: string;
}

export const ProfileTab: React.FC<IProfileTab> = ({ profileName, bullet, cartridge, id }) => {
    const { t } = useTranslation();
    const openProfileViewModal = useModalControllerStore(store => store.openProfileViewModal);
    const { selectedProfiles, deselectProfile, selectProfile } = useProfileStore(state => ({
        selectedProfiles: state.selectedProfiles,
        selectProfile: state.selectProfile,
        deselectProfile: state.deselectProfile,
    }));

    const isSelected = !!selectedProfiles.find(el => el === id);

    const handlePress = () => {
        if (isSelected) {
            deselectProfile(id);
            return;
        }
        selectProfile(id);
    };

    return (
        <ProfileTabCard isSelected={isSelected}>
            <SeparateRow>
                <TextSemiBold24>{profileName}</TextSemiBold24>
                <DefaultButton onPress={handlePress}>
                    <ButtonTextBold18>{isSelected ? t('default_deselect') : t('default_select')}</ButtonTextBold18>
                </DefaultButton>
            </SeparateRow>
            <DefaultRow>
                <Text20>{t('profile_bullet')}</Text20>
                <Text20>{bullet}</Text20>
            </DefaultRow>
            <DefaultRow>
                <Text20>{t('profile_cartridge')}</Text20>
                <Text20>{cartridge}</Text20>
            </DefaultRow>

            <DefaultButton onPress={() => openProfileViewModal(id)}>
                <ButtonTextBold18>{t('default_more_info')}</ButtonTextBold18>
            </DefaultButton>
        </ProfileTabCard>
    );
};
