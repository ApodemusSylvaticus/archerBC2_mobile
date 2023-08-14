import { number, object } from 'yup';
import React from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { IForm } from '@/interface/form';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';

const schema = object().shape({
    muzzleVelocity: number().required('Required').max(50, 'Too Long!'),
    powderTemperature: number().required('Required').max(50, 'Too Long!'),
    ratio: number().required('Required').max(50, 'Too Long!'),
});

export const CartridgeForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { rem, colors } = useTheme();

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
                    <DefaultInput
                        label="Muzzle velocity"
                        value={values.muzzleVelocity.toString()}
                        onChangeText={handleChange('muzzleVelocity')}
                        error={errors.muzzleVelocity}
                        touched={touched.muzzleVelocity}
                        onBlur={handleBlur('muzzleVelocity')}
                        keyboardType="numeric"
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label="Powder temperature"
                        value={values.powderTemperature.toString()}
                        onChangeText={handleChange('powderTemperature')}
                        error={errors.powderTemperature}
                        touched={touched.powderTemperature}
                        onBlur={handleBlur('powderTemperature')}
                        keyboardType="numeric"
                        background={colors.appBg}
                    />

                    <DefaultInput
                        label="Ratio"
                        value={values.ratio.toString()}
                        onChangeText={handleChange('ratio')}
                        error={errors.ratio}
                        touched={touched.ratio}
                        keyboardType="numeric"
                        onBlur={handleBlur('ratio')}
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
