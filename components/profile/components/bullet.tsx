import React from 'react';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IBullet } from '@/interface/profile';

export const Bullet: React.FC<WithId<IBullet>> = ({
    coefCustom,
    coefG1,
    coefG7,
    bcType,
    id,
    bLength,
    bWeight,
    bDiameter,
}) => {
    console.log(id, coefCustom);

    const coefArr = bcType === 'G1' ? coefG1 : coefG7;
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
                <Text20>{bDiameter} inches</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Weight:</Text20>
                <Text20>{bWeight} grains</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Length:</Text20>
                <Text20>{bLength} inches</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Used function:</Text20>
                <Text20>{bcType}</Text20>
            </DefaultRow>

            <DefaultRow>
                <Text20>Coefficients:</Text20>
                {coefArr.map((el, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <Text20 key={index}>
                        mv {el.mv} m/s bc {el.bc} lb/in^2
                    </Text20>
                ))}
            </DefaultRow>
        </DefaultCard>
    );
};
