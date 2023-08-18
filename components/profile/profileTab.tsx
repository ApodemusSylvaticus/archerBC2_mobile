import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { DefaultButton } from '@/components/button/style';
import { ButtonTextBold18, Text20, TextSemiBold24 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';

export interface IProfileTab {
    profileName: string;
    bullet: string;
    cartridge: string;
    id: string;
}

export const ProfileTab: React.FC<IProfileTab> = ({ profileName, bullet, cartridge, id }) => {
    const openProfileViewModal = useModalControllerStore(store => store.openProfileViewModal);
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{profileName}</TextSemiBold24>
                <DefaultButton>
                    <ButtonTextBold18>Select</ButtonTextBold18>
                </DefaultButton>
            </SeparateRow>
            <DefaultRow>
                <Text20>Bullet:</Text20>
                <Text20>{bullet}</Text20>
            </DefaultRow>
            <DefaultRow>
                <Text20>Cartridge:</Text20>
                <Text20>{cartridge}</Text20>
            </DefaultRow>

            <DefaultButton onPress={() => openProfileViewModal(id)}>
                <ButtonTextBold18>More info</ButtonTextBold18>
            </DefaultButton>
        </DefaultCard>
    );
};
