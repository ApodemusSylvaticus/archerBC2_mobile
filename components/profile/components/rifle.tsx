import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, Text20Uint, TextWithUintContainer } from '@/components/profile/components/style';
import { RiffleForm } from '@/components/forms/riffleForm';
import { RiffleProfileProps } from '@/interface/form';

export const Rifle: React.FC<RiffleProfileProps> = React.memo(
    ({ scHeight, rTwist, twistDir, caliber, fileName, handleChange }) => {
        const { t } = useTranslation();
        const [isEditMode, setIsEditMode] = useState<boolean>(false);
        const { colors } = useTheme();

        const list = ['LEFT', 'RIGHT'] as const;
        const index = list.findIndex(el => el === twistDir);
        const translatedList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

        return (
            <DefaultCard>
                <SeparateRow>
                    <TextSemiBold24>{t('profile_riffle')}</TextSemiBold24>
                    <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                        <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                    </DefaultButton>
                </SeparateRow>

                {isEditMode ? (
                    <RiffleForm
                        withList={false}
                        riffle={{
                            caliber,
                            scHeight: scHeight.toString(),
                            twistDir,
                            rTwist: rTwist.toString(),
                            fileName,
                        }}
                        labelBg={colors.cardBg}
                        onSubmit={value => {
                            handleChange({
                                fileName,
                                rTwist: +value.rTwist,
                                scHeight: +value.scHeight,
                                twistDir: value.twistDir,
                                caliber: value.caliber,
                            });
                            setIsEditMode(false);
                        }}
                        navigation={{ type: 'V2' }}
                    />
                ) : (
                    <>
                        <DefaultRow>
                            <Text20>{t('profile_caliber')}</Text20>
                            <Text20>{caliber}</Text20>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_twist_direction')}</Text20>
                            <Text20>{translatedList[index]}</Text20>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_twist_rate')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{rTwist}</Text20>
                                <Text20Uint>{t('uint_inches_dash_turn')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_scope_height')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{scHeight}</Text20>
                                <Text20Uint>{t('uint_mm')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>
                    </>
                )}
            </DefaultCard>
        );
    },
);
