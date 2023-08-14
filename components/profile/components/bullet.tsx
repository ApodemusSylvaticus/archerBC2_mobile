import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';

export const Bullet: React.FC = () => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Bullet</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>

            <DefaultRow>
                <Text20>Diameter:</Text20>
                <Text20>0.0024 inches</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Weight:</Text20>
                <Text20>2 grains</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Length:</Text20>
                <Text20>3 inches</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Used function:</Text20>
                <Text20>G1</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Table rows count:</Text20>
                <Text20>1</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Coefficients:</Text20>
                <Text20>mv 0 m/s bc 1 lb/in^2</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
