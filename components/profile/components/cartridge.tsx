import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { ICartridge } from '@/interface/profile';

export const Cartridge: React.FC<WithId<ICartridge>> = ({ cTCoeff, cMuzzleVelocity, cZeroTemperature, id }) => {
    console.log(id);

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Cartridge</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>

            <DefaultRow>
                <Text20>Muzzle velocity:</Text20>
                <Text20>{cMuzzleVelocity} ms</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Powder temperature:</Text20>
                <Text20>{cZeroTemperature} C</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Ratio:</Text20>
                <Text20>{cTCoeff} %/15C</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
