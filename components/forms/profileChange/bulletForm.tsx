import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import { Coefficient } from '@/interface/profile';
import { ballisticFunctionList } from '@/constant/profile';
import { NumericInput } from '@/components/Inputs/numericInput';
import { SelectInput } from '@/components/Inputs/select/select';
import { AddNewCoeffButton, ErrorText, MultiCoefficientWrapper } from '@/components/forms/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';
import { BulletProfileFormProps } from '@/interface/form';

// TODO: unite with another bullet form and split this
export const BulletForm: React.FC<BulletProfileFormProps> = ({ bullet, onSubmit, close }) => {
    const { bDiameter, bWeight, bLength, bcType, fileName, coefG1, coefG7, coefCustom } = bullet;
    const { bulletSchema } = useValidationSchema();
    const inputValue = { bDiameter: bDiameter.toString(), bLength: bLength.toString(), bWeight: bWeight.toString() };
    const { t } = useTranslation();
    const { colors } = useTheme();

    const [actualBallisticFunction, setActualBallisticFunction] = useState(
        ballisticFunctionList.findIndex(el => el === bcType),
    );

    const [coefficients, setCoefficients] = useState(
        coefG1.map(el => ({
            bcCd: el.bcCd.toString(),
            mv: el.mv.toString(),
        })),
    );
    const { mvSchema, bcSchema } = useValidationSchema();

    const [handleError, setHandleError] = useState('');
    const addOneMoreCoeff = () => setCoefficients(prevState => [...prevState, { mv: '', bcCd: '' }]);

    const handleChangeMV = (val: string, index: number) => {
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, mv: val } : el)));
    };
    const handleChangeBC = (val: string, index: number) => {
        setHandleError('');
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, bcCd: val } : el)));
    };

    const handleDataSubmit = (value: { bDiameter: string; bLength: string; bWeight: string }) => {
        const validCoefficient: Coefficient[] = [];
        coefficients.forEach(el => {
            const bcCd = +el.bcCd;
            if (el.bcCd === '' || Number.isNaN(bcCd)) {
                return;
            }
            if (bcCd <= 0 || bcCd > 10) {
                return;
            }
            if (el.mv === '') {
                validCoefficient.push({ mv: 0, bcCd });
                return;
            }

            const mv = +el.mv;

            if (Number.isNaN(mv)) {
                return;
            }

            if (mv <= 0 || mv > 3000) {
                return;
            }
            validCoefficient.push({ mv, bcCd });
        });

        if (validCoefficient.length === 0) {
            setHandleError('At least 1 coefficient must be filled');
            return;
        }

        const newCoefficients = validCoefficient.map(el => ({ bcCd: +el.bcCd, mv: +el.mv }));

        onSubmit({
            bDiameter: +value.bDiameter,
            coefG1: ballisticFunctionList[actualBallisticFunction] === 'G1' ? newCoefficients : coefG1,
            coefG7: ballisticFunctionList[actualBallisticFunction] === 'G7' ? newCoefficients : coefG7,
            coefCustom,
            bcType: ballisticFunctionList[actualBallisticFunction],
            bLength: +value.bLength,
            bWeight: +value.bWeight,
            fileName,
        });
        close();
    };

    useEffect(() => {
        const actualBF = ballisticFunctionList[actualBallisticFunction];
        switch (actualBF) {
            case 'G1':
                setCoefficients(
                    coefG1.map(el => ({
                        bcCd: el.bcCd.toString(),
                        mv: el.mv.toString(),
                    })),
                );
                break;
            case 'G7':
                setCoefficients(
                    coefG7.map(el => ({
                        bcCd: el.bcCd.toString(),
                        mv: el.mv.toString(),
                    })),
                );
                break;
            case 'Custom':
                setCoefficients(
                    coefCustom.map(el => ({
                        bcCd: el.bcCd.toString(),
                        mv: el.mv.toString(),
                    })),
                );
                break;
            default:
                throw new Error('actualBF is not found');
        }
    }, [actualBallisticFunction, coefCustom, coefG1, coefG7]);

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                handleDataSubmit(value);
            }}
            validationSchema={bulletSchema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultRow>
                        <NumericInput
                            label={t('profile_diameter')}
                            value={values.bDiameter}
                            onChangeText={handleChange('bDiameter')}
                            error={errors.bDiameter}
                            uint={t('uint_inches')}
                            touched={touched.bDiameter}
                            onBlur={handleBlur('bDiameter')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            label={t('profile_weight')}
                            value={values.bWeight}
                            onChangeText={handleChange('bWeight')}
                            error={errors.bWeight}
                            touched={touched.bWeight}
                            onBlur={handleBlur('bWeight')}
                            background={colors.cardBg}
                            uint={t('uint_grains')}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            label={t('profile_length')}
                            value={values.bLength}
                            onChangeText={handleChange('bLength')}
                            error={errors.bLength}
                            touched={touched.bLength}
                            onBlur={handleBlur('bLength')}
                            uint={t('uint_inches')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <SelectInput
                        label={t('profile_ballistic_function')}
                        background={colors.cardBg}
                        chosenEl={actualBallisticFunction}
                        list={ballisticFunctionList}
                        setElem={val => setActualBallisticFunction(val)}
                        zIndex={3}
                    />

                    {coefficients.map((el, index) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <MultiCoefficientWrapper key={index}>
                            <NumericInput
                                uint={t('uint_m_dash_s')}
                                label={t('profile_mv')}
                                value={el.mv}
                                schema={mvSchema}
                                onChangeText={(val: string) => handleChangeMV(val, index)}
                                onBlur={() => undefined}
                                background={colors.cardBg}
                            />
                            <NumericInput
                                uint={t('uint_lb_dash_square_in')}
                                label={t('profile_bc')}
                                value={el.bcCd}
                                schema={bcSchema}
                                onChangeText={(val: string) => handleChangeBC(val, index)}
                                onBlur={() => undefined}
                                background={colors.cardBg}
                            />
                        </MultiCoefficientWrapper>
                    ))}

                    {handleError && <ErrorText>{handleError}</ErrorText>}
                    {coefficients.length < 5 && (
                        <AddNewCoeffButton onPress={addOneMoreCoeff}>
                            <TextSemiBold20>{t('profile_add_new_coefficient')}</TextSemiBold20>
                        </AddNewCoeffButton>
                    )}

                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};
