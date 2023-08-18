import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IDescription } from '@/interface/profile';

export const Description: React.FC<WithId<IDescription>> = ({
    shortNameBot,
    bulletName,
    shortNameTop,
    cartridgeName,
    profileName,
    id,
    userNote,
}) => {
    console.log(id);

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Description</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>
            <DefaultRow>
                <Text20>Profile name:</Text20>
                <Text20>{profileName}</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Top:</Text20>
                <Text20>{shortNameTop}</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Bottom:</Text20>
                <Text20>{shortNameBot}</Text20>
            </DefaultRow>

            <DefaultRow>
                <TextSemiBold24>Round</TextSemiBold24>
            </DefaultRow>

            <DefaultRow>
                <Text20>Cartridge:</Text20>
                <Text20>{cartridgeName}</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Bullet:</Text20>
                <Text20>{bulletName}</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>User note</Text20>
                <Text20>{userNote}</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
