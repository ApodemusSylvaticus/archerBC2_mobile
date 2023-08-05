import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { ButtonTextBold18, Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { Line } from '@/components/line';

export const Description: React.FC = () => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Description</TextSemiBold24>
                <DefaultButton>
                    <ButtonTextBold18>Edit</ButtonTextBold18>
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
                <Line />
            </DefaultRow>

            <DefaultRow>
                <Text20>Cartridge:</Text20>
                <Text20>Cartridge</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Bullet:</Text20>
                <Text20>Bullet</Text20>
            </DefaultRow>

            <Line />

            <DefaultRow>
                <Text20>User note</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
