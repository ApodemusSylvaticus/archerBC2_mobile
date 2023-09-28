import React from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { CartridgeProfileFormProps, IForm } from '@/interface/form';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { NumericInput } from '@/components/Inputs/numericInput';
import { DefaultFormNavigation } from '@/components/forms/newProfile/defaultFormNavigation';
import { SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '../container/defaultBox';

export const CartridgeForm: React.FC<CartridgeProfileFormProps> = ({ cartridge, navigation, labelBg, onSubmit }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const { cartridgeSchema } = useValidationSchema();

    return (
        <Formik
            initialValues={cartridge}
            onSubmit={values => {
                onSubmit(values);
            }}
            validationSchema={cartridgeSchema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_m_dash_s')}
                            label={t('profile_muzzle_velocity')}
                            value={values.cMuzzleVelocity.toString()}
                            onChangeText={handleChange('cMuzzleVelocity')}
                            error={errors.cMuzzleVelocity}
                            touched={touched.cMuzzleVelocity}
                            onBlur={handleBlur('cMuzzleVelocity')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_temperature')}
                            label={t('profile_powder_temperature')}
                            value={values.cZeroTemperature.toString()}
                            onChangeText={handleChange('cZeroTemperature')}
                            error={errors.cZeroTemperature}
                            touched={touched.cZeroTemperature}
                            onBlur={handleBlur('cZeroTemperature')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_percent_dash_temperature')}
                            label={t('profile_ratio')}
                            value={values.cTCoeff.toString()}
                            onChangeText={handleChange('cTCoeff')}
                            error={errors.cTCoeff}
                            touched={touched.cTCoeff}
                            onBlur={handleBlur('cTCoeff')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    {navigation.type === 'V1' && (
                        <DefaultFormNavigation
                            goBackAction={navigation.goBack}
                            goBackButtonColor={colors.primary}
                            goForwardAction={handleSubmit}
                            goForwardButtonColor={
                                isAllTouched(values) && isValid ? colors.activeTab : colors.l1ActiveEl
                            }
                        />
                    )}

                    {navigation.type === 'V2' && (
                        <SubmitButton onPress={() => isValid && handleSubmit()}>
                            <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                        </SubmitButton>
                    )}
                </>
            )}
        </Formik>
    );
};

export const NewCartridgeForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { cartridge, setCartridge } = useNewProfileStore(state => ({
        cartridge: state.cartridge,
        setCartridge: state.setCartridge,
    }));
    const { colors } = useTheme();

    return (
        <CartridgeForm
            cartridge={{ ...cartridge, fileName: 'crunch' }}
            onSubmit={({ cZeroTemperature, cMuzzleVelocity, cTCoeff }) => {
                setCartridge({
                    cZeroTemperature,
                    cMuzzleVelocity,
                    cTCoeff,
                });
                goForward();
            }}
            labelBg={colors.appBg}
            navigation={{ type: 'V1', goBack }}
        />
    );
};
