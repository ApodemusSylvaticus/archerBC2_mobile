import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IZeroing } from '@/interface/profile';

export const Zeroing: React.FC<WithId<IZeroing>> = ({
    zeroY,
    zeroX,
    cZeroPTemperature,
    cZeroAirTemperature,
    cZeroAirHumidity,
    cZeroAirPressure,
    cZeroWPitch,
    cZeroDistanceIdx,
    distances,
    id,
}) => {
    console.log(id);

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Zeroing</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Edit</ButtonText>
                </DefaultButton>
            </SeparateRow>

            <DefaultRow>
                <Text20>ZeroX:</Text20>
                <Text20>{zeroX} click</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>ZeroY:</Text20>
                <Text20>{zeroY} click</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Zero distance:</Text20>
                <Text20>{distances[cZeroDistanceIdx]} m</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Air:</Text20>
                <Text20>{cZeroAirTemperature} C</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Pressure:</Text20>
                <Text20>{cZeroAirPressure} hPa</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Pitch:</Text20>
                <Text20>{cZeroWPitch} degrees</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Powder:</Text20>
                <Text20>{cZeroPTemperature} C</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Powder:</Text20>
                <Text20>{cZeroPTemperature} C</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Humidity:</Text20>
                <Text20>{cZeroAirHumidity} %</Text20>
            </DefaultRow>
        </DefaultCard>
    );
};
