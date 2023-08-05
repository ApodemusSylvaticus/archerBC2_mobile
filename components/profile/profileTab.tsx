import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { DefaultButton } from '@/components/button/style';
import { ButtonTextBold18, Text20, TextSemiBold24 } from '@/components/text/styled';

export interface IProfileTab {
    profileName: string;
    bullet: string;
    cartridge: string;
}

export const ProfileTab: React.FC<IProfileTab> = ({ profileName, bullet, cartridge }) => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{profileName}</TextSemiBold24>
                <DefaultButton>
                    <ButtonTextBold18>Edit</ButtonTextBold18>
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
        </DefaultCard>
    );
};
