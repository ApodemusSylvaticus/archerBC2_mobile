import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import { number, object } from 'yup';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { ICartridge } from '@/interface/profile';
import { useProfileStore } from '@/store/useProfileStore';
import { NumericInput } from '@/components/Inputs/numericInput';

const schema = object().shape({
    cMuzzleVelocity: number().required('Required').min(10).max(3000, 'Too Long!'),
    cZeroTemperature: number().required('Required').min(-100).max(100, 'Too Long!'),
    cTCoeff: number().required('Required').min(0).max(5, 'Too Long!'),
});

export const CartridgeForm: React.FC<WithId<ICartridge & { close: () => void }>> = ({
    cZeroTemperature,
    id,
    cTCoeff,
    cMuzzleVelocity,
    close,
}) => {
    const inputValue = {
        cZeroTemperature: cZeroTemperature.toString(),
        cTCoeff: cTCoeff.toString(),
        cMuzzleVelocity: cMuzzleVelocity.toString(),
    };
    const setCartridge = useProfileStore(state => state.setCartridge);
    const { t } = useTranslation();

    const { colors } = useTheme();

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                setCartridge({
                    id,
                    cTCoeff: +value.cTCoeff,
                    cMuzzleVelocity: +value.cMuzzleVelocity,
                    cZeroTemperature: +value.cZeroTemperature,
                });
                close();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <NumericInput
                        label={t('profile_muzzle_velocity')}
                        value={values.cMuzzleVelocity}
                        onChangeText={handleChange('cMuzzleVelocity')}
                        error={errors.cMuzzleVelocity}
                        touched={touched.cMuzzleVelocity}
                        onBlur={handleBlur('cMuzzleVelocity')}
                        background={colors.cardBg}
                        uint={t('uint_m_dash_s')}
                    />

                    <NumericInput
                        label={t('profile_powder_temperature')}
                        value={values.cZeroTemperature}
                        onChangeText={handleChange('cZeroTemperature')}
                        error={errors.cZeroTemperature}
                        touched={touched.cZeroTemperature}
                        onBlur={handleBlur('cZeroTemperature')}
                        background={colors.cardBg}
                        uint={t('uint_temperature')}
                    />

                    <NumericInput
                        label={t('profile_ratio')}
                        value={values.cTCoeff}
                        onChangeText={handleChange('cTCoeff')}
                        error={errors.cTCoeff}
                        touched={touched.cTCoeff}
                        onBlur={handleBlur('cTCoeff')}
                        background={colors.cardBg}
                        uint={t('uint_percent_dash_temperature')}
                    />

                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};

export const Cartridge: React.FC<WithId<ICartridge>> = ({ cTCoeff, cMuzzleVelocity, cZeroTemperature, id }) => {
    const { t } = useTranslation();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_cartridge')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <CartridgeForm
                    cTCoeff={cTCoeff}
                    cZeroTemperature={cZeroTemperature}
                    cMuzzleVelocity={cMuzzleVelocity}
                    close={() => setIsEditMode(false)}
                    id={id}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_muzzle_velocity')}</Text20>
                        <Text20>
                            {cMuzzleVelocity} {t('uint_m_dash_s')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_powder_temperature')}</Text20>
                        <Text20>
                            {cZeroTemperature} {t('uint_temperature')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_ratio')}</Text20>
                        <Text20>
                            {cTCoeff} {t('uint_percent_dash_temperature')}
                        </Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
