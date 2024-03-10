import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultColumnContainer, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import {
    ButtonText,
    CoefRow,
    Text20Uint,
    TextWithUintBorderLeft,
    TextWithUintBorderRight,
    TextWithUintContainer,
} from '@/components/profile/components/style';
import { BulletForm } from '@/components/forms/profileChange/bulletForm';
import { BulletProfileProps } from '@/interface/form';

export const Bullet: React.FC<BulletProfileProps> = React.memo(
    ({ coefCustom, coefG1, coefG7, bcType, fileName, bLength, bWeight, bDiameter, handleChange }) => {
        const [isEditMode, setIsEditMode] = useState<boolean>(false);
        const { t } = useTranslation();

        const coefArr = bcType === 'G1' ? coefG1 : coefG7;
        return (
            <DefaultCard>
                <SeparateRow>
                    <TextSemiBold24>{t('profile_bullet')}</TextSemiBold24>
                    <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                        <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                    </DefaultButton>
                </SeparateRow>

                {isEditMode ? (
                    <BulletForm
                        bullet={{ coefCustom, coefG1, coefG7, bcType, fileName, bLength, bWeight, bDiameter }}
                        onSubmit={handleChange}
                        close={() => setIsEditMode(false)}
                    />
                ) : (
                    <>
                        <DefaultRow>
                            <Text20>{t('profile_diameter')}</Text20>
                            <TextWithUintContainer>
                                <Text20>{bDiameter}</Text20>
                                <Text20Uint>{t('uint_inches')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>
                        <DefaultRow>
                            <Text20>{t('profile_weight')}</Text20>
                            <TextWithUintContainer>
                                <Text20>{bWeight}</Text20>
                                <Text20Uint>{t('uint_grains')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>
                        <DefaultRow>
                            <Text20>{t('profile_length')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{bLength}</Text20>
                                <Text20Uint>{t('uint_inches')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>
                        <DefaultRow>
                            <Text20>{t('profile_used_function')}</Text20>
                            <Text20>{bcType}</Text20>
                        </DefaultRow>
                        <DefaultColumnContainer>
                            <TextSemiBold20>{t('profile_coefficients')}:</TextSemiBold20>
                            {coefArr.map((el, index) => (
                                <CoefRow
                                    // eslint-disable-next-line react/no-array-index-key
                                    key={index}>
                                    <TextWithUintBorderRight>
                                        <Text20>
                                            {t('profile_mv')} {el.mv}
                                        </Text20>
                                        <Text20Uint>{t('uint_m_dash_s')}</Text20Uint>
                                    </TextWithUintBorderRight>

                                    <TextWithUintBorderLeft>
                                        <Text20>
                                            {t('profile_bc')} {el.bcCd}
                                        </Text20>
                                        <Text20Uint>{t('uint_lb_dash_square_in')}</Text20Uint>
                                    </TextWithUintBorderLeft>
                                </CoefRow>
                            ))}
                        </DefaultColumnContainer>
                    </>
                )}
            </DefaultCard>
        );
    },
);
