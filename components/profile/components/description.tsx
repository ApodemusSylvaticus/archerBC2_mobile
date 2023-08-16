import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';

export const Description: React.FC = () => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Description</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>
            <DefaultRow>
                <Text20>Name:</Text20>
                <Text20>Name</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Top:</Text20>
                <Text20>Top</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Bottom:</Text20>
                <Text20>Bottom</Text20>
            </DefaultRow>

            <DefaultRow>
                <TextSemiBold24>Round</TextSemiBold24>
            </DefaultRow>

            <DefaultRow>
                <Text20>Cartridge:</Text20>
                <Text20>Cartridge</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Bullet:</Text20>
                <Text20>Bullet</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>User note</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
