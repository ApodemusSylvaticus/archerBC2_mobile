import { number, object } from 'yup';
import React from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { NumericInput } from '@/components/Inputs/numericInput';

const schema = object().shape({
    muzzleVelocity: number().required('Required').min(10).max(3000, 'Too Long!'),
    powderTemperature: number().required('Required').min(-100).max(100, 'Too Long!'),
    ratio: number().required('Required').min(0).max(5, 'Too Long!'),
});

export const CartridgeForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { rem, colors } = useTheme();
    const { t } = useTranslation();

    const { cartridge, setCartridge } = useNewProfileStore(state => ({
        cartridge: state.cartridge,
        setCartridge: state.setCartridge,
    }));

    return (
        <Formik
            initialValues={cartridge}
            onSubmit={powderTemperature => {
                setCartridge(powderTemperature);
                goForward();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <NumericInput
                        uint={t('uint_m_dash_s')}
                        label={t('profile_muzzle_velocity')}
                        value={values.muzzleVelocity.toString()}
                        onChangeText={handleChange('muzzleVelocity')}
                        error={errors.muzzleVelocity}
                        touched={touched.muzzleVelocity}
                        onBlur={handleBlur('muzzleVelocity')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint={t('uint_temperature')}
                        label={t('profile_powder_temperature')}
                        value={values.powderTemperature.toString()}
                        onChangeText={handleChange('powderTemperature')}
                        error={errors.powderTemperature}
                        touched={touched.powderTemperature}
                        onBlur={handleBlur('powderTemperature')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint={t('uint_percent_dash_temperature')}
                        label={t('profile_ratio')}
                        value={values.ratio.toString()}
                        onChangeText={handleChange('ratio')}
                        error={errors.ratio}
                        touched={touched.ratio}
                        onBlur={handleBlur('ratio')}
                        background={colors.appBg}
                    />

                    <ButtonContainer>
                        <ArrowSVG
                            orientation="left"
                            width={rem * 5.5}
                            height={rem * 5.5}
                            fillColor={colors.primary}
                            onPress={() => goBack()}
                        />
                        <ArrowSVG
                            orientation="right"
                            width={rem * 5.5}
                            height={rem * 5.5}
                            fillColor={isAllTouched(values) && isValid ? colors.activeTab : colors.l1ActiveEl}
                            onPress={handleSubmit}
                        />
                    </ButtonContainer>
                </>
            )}
        </Formik>
    );
};
