import React from 'react';
import { Formik } from 'formik';
import { number, object } from 'yup';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { NumericInput } from '@/components/Inputs/numericInput';

const schema = object().shape({
    diameter: number().required('Required').min(0.001).max(50, 'Too Long!'),
    weight: number().required('Required').min(1).max(6553.5, 'Too Long!'),
    length: number().required('Required').min(0.01).max(200, 'Too Long!'),
});
export const BulletForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { rem, colors } = useTheme();
    const { t } = useTranslation();

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
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <NumericInput
                        uint={t('uint_inches')}
                        label={t('profile_diameter')}
                        value={values.diameter}
                        onChangeText={handleChange('diameter')}
                        error={errors.diameter}
                        touched={touched.diameter}
                        onBlur={handleBlur('diameter')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint={t('uint_grains')}
                        label={t('profile_weight')}
                        value={values.weight}
                        onChangeText={handleChange('weight')}
                        error={errors.weight}
                        touched={touched.weight}
                        onBlur={handleBlur('weight')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint={t('uint_inches')}
                        label={t('profile_length')}
                        value={values.length}
                        onChangeText={handleChange('length')}
                        error={errors.length}
                        touched={touched.length}
                        onBlur={handleBlur('length')}
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
