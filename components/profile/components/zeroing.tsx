import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IZeroing } from '@/interface/profile';

import { ZeroingForm } from '@/components/forms/profileChange/zeroingForm';

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
                    zeroX={zeroX}
                    zeroY={zeroY}
                    cZeroAirHumidity={cZeroAirHumidity}
                    cZeroAirPressure={cZeroAirPressure}
                    cZeroAirTemperature={cZeroAirTemperature}
                    cZeroDistanceIdx={cZeroDistanceIdx}
                    cZeroWPitch={cZeroWPitch}
                    distances={distances}
                    cZeroPTemperature={cZeroPTemperature}
                    id={id}
                    close={() => setIsEditMode(false)}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_zeroX')}</Text20>
                        <Text20>
                            {zeroX} {t('uint_click')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_zeroY')}</Text20>
                        <Text20>
                            {zeroY} {t('uint_click')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_zero_distance')}</Text20>
                        <Text20>
                            {distances[cZeroDistanceIdx]} {t('uint_meter')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_air_temperature')}</Text20>
                        <Text20>
                            {cZeroAirTemperature} {t('uint_temperature')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_pressure')}</Text20>
                        <Text20>
                            {cZeroAirPressure} {t('uint_hpa')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_pitch')}</Text20>
                        <Text20>
                            {cZeroWPitch} {t('uint_degrees')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_powder_temperature')}</Text20>
                        <Text20>
                            {cZeroPTemperature} {t('uint_temperature')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_humidity')}</Text20>
                        <Text20>{cZeroAirHumidity} %</Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
