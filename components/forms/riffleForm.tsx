import { number, object, string } from 'yup';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { DefaultInput } from '../Inputs/defaultInput';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { SelectInput } from '@/components/Inputs/select/select';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { IForm } from '@/interface/form';
import { NumericInput } from '@/components/Inputs/numericInput';

const schema = object().shape({
    calibre: string().required('Required').max(50, 'Too Long!'),
    twistRate: number().required('Required').min(0).max(100),
    scopeHeight: number().required('Required').min(-5000).max(5000),
});

export const RiffleForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { rem, colors } = useTheme();

    const { riffle, setRiffle } = useNewProfileStore(state => ({
        riffle: state.riffle,
        setRiffle: state.setRiffle,
    }));

    const inputValue = riffle;

    const list = ['left', 'right'];
    const [twistDirectionState, setTwistDirectionState] = useState(
        list.findIndex(el => el === inputValue.twistDirection),
    );

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                setRiffle(value);
                goForward();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultInput
                        label="Calibre"
                        value={values.calibre}
                        onChangeText={handleChange('calibre')}
                        error={errors.calibre}
                        touched={touched.calibre}
                        onBlur={handleBlur('calibre')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        label="Twist rate"
                        uint="inches/turn"
                        value={values.twistRate}
                        onChangeText={handleChange('twistRate')}
                        error={errors.twistRate}
                        touched={touched.twistRate}
                        onBlur={handleBlur('twistRate')}
                        background={colors.appBg}
                    />

                    <SelectInput
                        label="Twist direction"
                        background={colors.appBg}
                        chosenEl={twistDirectionState}
                        list={list}
                        setElem={val => setTwistDirectionState(val)}
                    />

                    <NumericInput
                        label="Scope height"
                        uint="mm"
                        value={values.scopeHeight}
                        onChangeText={handleChange('scopeHeight')}
                        error={errors.scopeHeight}
                        touched={touched.scopeHeight}
                        onBlur={handleBlur('scopeHeight')}
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
