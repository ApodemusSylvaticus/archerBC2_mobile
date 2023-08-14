import React from 'react';
import { Formik } from 'formik';
import { number, object } from 'yup';
import { useTheme } from 'styled-components/native';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';

const schema = object().shape({
    diameter: number().required('Required').max(50, 'Too Long!'),
    weight: number().required('Required').max(50, 'Too Long!'),
    length: number().required('Required').max(50, 'Too Long!'),
});
export const BulletForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { rem, colors } = useTheme();

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
                    <DefaultInput
                        label="Diameter"
                        value={values.diameter}
                        onChangeText={handleChange('diameter')}
                        error={errors.diameter}
                        touched={touched.diameter}
                        onBlur={handleBlur('diameter')}
                        keyboardType="numeric"
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label="Weight"
                        value={values.weight}
                        onChangeText={handleChange('weight')}
                        error={errors.weight}
                        touched={touched.weight}
                        onBlur={handleBlur('weight')}
                        keyboardType="numeric"
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label="Length"
                        value={values.length}
                        onChangeText={handleChange('length')}
                        error={errors.length}
                        touched={touched.length}
                        onBlur={handleBlur('length')}
                        keyboardType="numeric"
                        background={colors.appBg}
                    />

                    <ButtonContainer>
                        <ArrowSVG
                            orientation="left"
                            size={rem * 5.5}
                            fillColor={colors.secondary}
                            onPress={() => goBack()}
                        />
                        <ArrowSVG
                            orientation="right"
                            size={rem * 5.5}
                            fillColor={isAllTouched(values) && isValid ? colors.activeTab : colors.l1ActiveEl}
                            onPress={handleSubmit}
                        />
                    </ButtonContainer>
                </>
            )}
        </Formik>
    );
};
