import React from 'react';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultInput } from '../Inputs/defaultInput';
import { ArrowSVG } from '@/components/svg/arrow';
import { ButtonContainer } from '@/components/forms/style';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { IForm } from '@/interface/form';

const schema = object().shape({
    name: string().required('Required').max(50, 'Too Long!'),
    cartridge: string().required('Required').max(50, 'Too Long!'),
    bullet: string().required('Required').max(50, 'Too Long!'),
});

export const DescriptionForm: React.FC<IForm> = ({ goForward }) => {
    const { rem, colors } = useTheme();
    const { setDescription, description } = useNewProfileStore(state => ({
        description: state.description,
        setDescription: state.setDescription,
    }));
    const { t } = useTranslation();

    return (
        <Formik
            initialValues={description}
            onSubmit={value => {
                setDescription(value);
                goForward();
            }}
            validationSchema={schema}>
            {({ touched, handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <>
                    <DefaultInput
                        label={t('profile_profile_name')}
                        value={values.name}
                        onChangeText={handleChange('name')}
                        error={errors.name}
                        touched={touched.name}
                        onBlur={handleBlur('name')}
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label={t('profile_cartridge_name')}
                        value={values.cartridge}
                        onChangeText={handleChange('cartridge')}
                        error={errors.cartridge}
                        touched={touched.cartridge}
                        onBlur={handleBlur('cartridge')}
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label={t('profile_bullet_name')}
                        value={values.bullet}
                        onChangeText={handleChange('bullet')}
                        error={errors.bullet}
                        touched={touched.bullet}
                        onBlur={handleBlur('bullet')}
                        background={colors.appBg}
                    />

                    <ButtonContainer>
                        <ArrowSVG
                            orientation="left"
                            width={rem * 5.5}
                            height={rem * 5.5}
                            fillColor="transparent"
                            onPress={() => undefined}
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
