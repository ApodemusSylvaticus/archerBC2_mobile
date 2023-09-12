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
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';

export const BulletForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { rem, colors } = useTheme();
    const { t } = useTranslation();
    const { bulletSchema } = useValidationSchema();

    const { bullet, setBullet } = useNewProfileStore(state => ({
        bullet: state.bullet,
        setBullet: state.setBullet,
    }));

    return (
        <Formik
            initialValues={bullet}
            onSubmit={data => {
                setBullet(data);
                goForward();
            }}
            validationSchema={bulletSchema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_inches')}
                            label={t('profile_diameter')}
                            value={values.bDiameter}
                            onChangeText={handleChange('bDiameter')}
                            error={errors.bDiameter}
                            touched={touched.bDiameter}
                            onBlur={handleBlur('bDiameter')}
                            background={colors.appBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_grains')}
                            label={t('profile_weight')}
                            value={values.bWeight}
                            onChangeText={handleChange('bWeight')}
                            error={errors.bWeight}
                            touched={touched.bWeight}
                            onBlur={handleBlur('bWeight')}
                            background={colors.appBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            uint={t('uint_inches')}
                            label={t('profile_length')}
                            value={values.bLength}
                            onChangeText={handleChange('bLength')}
                            error={errors.bLength}
                            touched={touched.bLength}
                            onBlur={handleBlur('bLength')}
                            background={colors.appBg}
                        />
                    </DefaultRow>

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
