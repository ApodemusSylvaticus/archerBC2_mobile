import React from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultInput } from '../../Inputs/defaultInput';
import { ArrowSVG } from '@/components/svg/arrow';
import { ButtonContainer } from '@/components/forms/style';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { IForm } from '@/interface/form';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';

export const DescriptionForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { rem, colors } = useTheme();
    const { setDescription, description } = useNewProfileStore(state => ({
        description: state.description,
        setDescription: state.setDescription,
    }));
    const { t } = useTranslation();
    const { descriptionSchema } = useValidationSchema();
    return (
        <Formik
            initialValues={description}
            onSubmit={value => {
                setDescription(value);
                goForward();
            }}
            validationSchema={descriptionSchema}>
            {({ touched, handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <>
                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_profile_name')}
                            value={values.profileName}
                            onChangeText={handleChange('profileName')}
                            error={errors.profileName}
                            touched={touched.profileName}
                            onBlur={handleBlur('profileName')}
                            background={colors.appBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_cartridge_name')}
                            value={values.cartridge}
                            onChangeText={handleChange('cartridge')}
                            error={errors.cartridge}
                            touched={touched.cartridge}
                            onBlur={handleBlur('cartridge')}
                            background={colors.appBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_bullet_name')}
                            value={values.bullet}
                            onChangeText={handleChange('bullet')}
                            error={errors.bullet}
                            touched={touched.bullet}
                            onBlur={handleBlur('bullet')}
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
