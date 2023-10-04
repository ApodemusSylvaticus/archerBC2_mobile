import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import { NumericInput } from '@/components/Inputs/numericInput';
import { SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';
import { ZeroingProfileFormProps } from '@/interface/form';

export const ZeroingForm: React.FC<ZeroingProfileFormProps> = ({ zeroing, onSubmit, close }) => {
    const {
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
    } = zeroing;
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
    const { zeroingSchema } = useValidationSchema();

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                const newDistance = [...distances];
                newDistance[cZeroDistanceIdx] = +value.cZeroDistanceValue;
                onSubmit({
                    zeroX: +value.zeroX,
                    zeroY: +value.zeroY,
                    cZeroPTemperature: +value.cZeroPTemperature,
                    cZeroAirTemperature: +value.cZeroAirTemperature,
                    cZeroAirHumidity: +value.cZeroAirHumidity,
                    cZeroAirPressure: +value.cZeroAirPressure,
                    cZeroWPitch: +value.cZeroWPitch,
                    cZeroDistanceIdx,
                    distances: newDistance,
                    fileName,
                });
                close();
            }}
            validationSchema={zeroingSchema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <DefaultRow>
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
                    </DefaultRow>

                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};
