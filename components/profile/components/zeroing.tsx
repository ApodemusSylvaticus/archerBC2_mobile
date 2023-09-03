import React, { useState } from 'react';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { number, object } from 'yup';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IZeroing } from '@/interface/profile';
import { NumericInput } from '@/components/Inputs/numericInput';
import { useProfileStore } from '@/store/useProfileStore';

const schema = object().shape({
    zeroX: number().required('Required').min(-200).max(200),
    zeroY: number().required('Required').min(-200).max(200),
    cZeroWPitch: number().required('Required').min(-90).max(90),
    cZeroDistanceValue: number().required('Required').min(0).max(3000),
    cZeroAirTemperature: number().required('Required').min(-100).max(100),
    cZeroAirPressure: number().required('Required').min(300).max(1500),
    cZeroPTemperature: number().required('Required').min(-100).max(100),
    cZeroAirHumidity: number().required('Required').min(0).max(100),
});

export const ZeroingForm: React.FC<WithId<IZeroing & { close: () => void }>> = ({
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
    close,
}) => {
    const inputValue = {
        zeroY: zeroY.toString(),
        zeroX: zeroX.toString(),
        cZeroPTemperature: cZeroPTemperature.toString(),
        cZeroAirHumidity: cZeroAirHumidity.toString(),
        cZeroAirPressure: cZeroAirPressure.toString(),
        cZeroAirTemperature: cZeroAirTemperature.toString(),
        cZeroWPitch: cZeroWPitch.toString(),
        cZeroDistanceValue: distances[cZeroDistanceIdx].toString(),
    };
    const { t } = useTranslation();
    const { colors } = useTheme();
    const setZeroing = useProfileStore(state => state.setZeroing);

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                const newDistance = [...distances];
                newDistance[cZeroDistanceIdx] = +value.cZeroDistanceValue;
                setZeroing({
                    zeroX: +value.zeroX,
                    zeroY: +value.zeroY,
                    cZeroPTemperature: +value.cZeroPTemperature,
                    cZeroAirTemperature: +value.cZeroAirTemperature,
                    cZeroAirHumidity: +value.cZeroAirHumidity,
                    cZeroAirPressure: +value.cZeroAirPressure,
                    cZeroWPitch: +value.cZeroWPitch,
                    cZeroDistanceIdx,
                    distances: newDistance,
                    id,
                });
                close();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <NumericInput
                        label={t('profile_zeroX')}
                        value={values.zeroX}
                        onChangeText={handleChange('zeroX')}
                        error={errors.zeroX}
                        touched={touched.zeroX}
                        onBlur={handleBlur('zeroX')}
                        background={colors.cardBg}
                        uint={t('uint_click')}
                    />

                    <NumericInput
                        label={t('profile_zeroY')}
                        value={values.zeroY}
                        onChangeText={handleChange('zeroY')}
                        error={errors.zeroY}
                        touched={touched.zeroY}
                        onBlur={handleBlur('zeroY')}
                        background={colors.cardBg}
                        uint={t('uint_click')}
                    />

                    <NumericInput
                        label={t('profile_zeroY')}
                        value={values.zeroY}
                        onChangeText={handleChange('zeroY')}
                        error={errors.zeroY}
                        touched={touched.zeroY}
                        onBlur={handleBlur('zeroY')}
                        background={colors.cardBg}
                        uint={t('uint_click')}
                    />

                    <NumericInput
                        label={t('profile_zero_distance')}
                        value={values.cZeroDistanceValue}
                        onChangeText={handleChange('cZeroDistanceValue')}
                        error={errors.cZeroDistanceValue}
                        touched={touched.cZeroDistanceValue}
                        onBlur={handleBlur('cZeroDistanceValue')}
                        background={colors.cardBg}
                        uint={t('uint_meter')}
                    />

                    <NumericInput
                        label={t('profile_air')}
                        uint={t('uint_temperature')}
                        value={values.cZeroAirTemperature}
                        onChangeText={handleChange('cZeroAirTemperature')}
                        error={errors.cZeroAirTemperature}
                        touched={touched.cZeroAirTemperature}
                        onBlur={handleBlur('cZeroAirTemperature')}
                        background={colors.cardBg}
                    />

                    <NumericInput
                        label={t('profile_pressure')}
                        uint={t('uint_hpa')}
                        value={values.cZeroAirPressure}
                        onChangeText={handleChange('cZeroAirPressure')}
                        error={errors.cZeroAirPressure}
                        touched={touched.cZeroAirPressure}
                        onBlur={handleBlur('cZeroAirPressure')}
                        background={colors.cardBg}
                    />

                    <NumericInput
                        label={t('profile_pitch')}
                        uint={t('uint_degrees')}
                        value={values.cZeroWPitch}
                        onChangeText={handleChange('cZeroWPitch')}
                        error={errors.cZeroWPitch}
                        touched={touched.cZeroWPitch}
                        onBlur={handleBlur('cZeroWPitch')}
                        background={colors.cardBg}
                    />

                    <NumericInput
                        label={t('profile_powder_temperature')}
                        uint={t('uint_temperature')}
                        value={values.cZeroPTemperature}
                        onChangeText={handleChange('cZeroPTemperature')}
                        error={errors.cZeroPTemperature}
                        touched={touched.cZeroPTemperature}
                        onBlur={handleBlur('cZeroPTemperature')}
                        background={colors.cardBg}
                    />

                    <NumericInput
                        label={t('profile_humidity')}
                        uint="%"
                        value={values.cZeroAirHumidity}
                        onChangeText={handleChange('cZeroAirHumidity')}
                        error={errors.cZeroAirHumidity}
                        touched={touched.cZeroAirHumidity}
                        onBlur={handleBlur('cZeroAirHumidity')}
                        background={colors.cardBg}
                    />

                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};

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
                        <Text20>{t('profile_air')}</Text20>
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
