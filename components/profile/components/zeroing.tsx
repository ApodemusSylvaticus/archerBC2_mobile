import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, Text20Uint, TextWithUintContainer } from '@/components/profile/components/style';
import { ZeroingForm } from '@/components/forms/profileChange/zeroingForm';
import { ZeroingProfileProps } from '@/interface/form';

export const Zeroing: React.FC<ZeroingProfileProps> = React.memo(
    ({
        zeroY,
        zeroX,
        cZeroPTemperature,
        cZeroAirTemperature,
        cZeroAirHumidity,
        cZeroAirPressure,
        cZeroWPitch,
        cZeroDistanceIdx,
        distances,
        fileName,
        handleChange,
    }) => {
        const { t } = useTranslation();
        const [isEditMode, setIsEditMode] = useState<boolean>(false);

        return (
            <DefaultCard>
                <SeparateRow>
                    <TextSemiBold24>{t('profile_zeroing')}</TextSemiBold24>
                    <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                        <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                    </DefaultButton>
                </SeparateRow>

                {isEditMode ? (
                    <ZeroingForm
                        onSubmit={handleChange}
                        zeroing={{
                            zeroY,
                            zeroX,
                            cZeroPTemperature,
                            cZeroAirTemperature,
                            cZeroAirHumidity,
                            cZeroAirPressure,
                            cZeroWPitch,
                            cZeroDistanceIdx,
                            distances,
                            fileName,
                        }}
                        close={() => setIsEditMode(false)}
                    />
                ) : (
                    <>
                        <DefaultRow>
                            <Text20>{t('profile_zeroX')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{zeroX}</Text20>
                                <Text20Uint>{t('uint_click')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_zeroY')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{zeroY}</Text20>
                                <Text20Uint>{t('uint_click')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_zero_distance')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{distances[cZeroDistanceIdx]}</Text20>
                                <Text20Uint>{t('uint_meter')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_air_temperature')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{cZeroAirTemperature}</Text20>
                                <Text20Uint>{t('uint_temperature')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_pressure')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{cZeroAirPressure}</Text20>
                                <Text20Uint>{t('uint_hpa')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_pitch')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{cZeroWPitch}</Text20>
                                <Text20Uint>{t('uint_degrees')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_powder_temperature')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{cZeroPTemperature}</Text20>
                                <Text20Uint>{t('uint_temperature')}</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>

                        <DefaultRow>
                            <Text20>{t('profile_humidity')}</Text20>

                            <TextWithUintContainer>
                                <Text20>{cZeroAirHumidity}</Text20>
                                <Text20Uint>%</Text20Uint>
                            </TextWithUintContainer>
                        </DefaultRow>
                    </>
                )}
            </DefaultCard>
        );
    },
);
