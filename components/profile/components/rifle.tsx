import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';

export const Rifle: React.FC = () => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Rifle</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>

            <DefaultRow>
                <Text20>Twist direction:</Text20>
                <Text20>right</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Twist rate:</Text20>
                <Text20>3 inches/turn</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Calibre:</Text20>
                <Text20>.22-250 Remington</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Scope hight:</Text20>
                <Text20>11mm</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
