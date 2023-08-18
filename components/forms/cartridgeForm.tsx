import { number, object } from 'yup';
import React from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
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
                        uint="m/s"
                        label="Muzzle velocity"
                        value={values.muzzleVelocity.toString()}
                        onChangeText={handleChange('muzzleVelocity')}
                        error={errors.muzzleVelocity}
                        touched={touched.muzzleVelocity}
                        onBlur={handleBlur('muzzleVelocity')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint="C"
                        label="Powder temperature"
                        value={values.powderTemperature.toString()}
                        onChangeText={handleChange('powderTemperature')}
                        error={errors.powderTemperature}
                        touched={touched.powderTemperature}
                        onBlur={handleBlur('powderTemperature')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        uint="%/15C"
                        label="Ratio"
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
