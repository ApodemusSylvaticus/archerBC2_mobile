import { number, object, string } from 'yup';
import React, { useState } from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { rem, colors } = useTheme();

    const { riffle, setRiffle } = useNewProfileStore(state => ({
        riffle: state.riffle,
        setRiffle: state.setRiffle,
    }));

    const list = ['left', 'right'] as const;

    const translateList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

    const [twistDirectionState, setTwistDirectionState] = useState(list.findIndex(el => el === riffle.twistDirection));

    return (
        <Formik
            initialValues={riffle}
            onSubmit={value => {
                setRiffle({ ...value, twistDirection: list[twistDirectionState] });
                goForward();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultInput
                        label={t('profile_calibre')}
                        value={values.calibre}
                        onChangeText={handleChange('calibre')}
                        error={errors.calibre}
                        touched={touched.calibre}
                        onBlur={handleBlur('calibre')}
                        background={colors.appBg}
                    />

                    <NumericInput
                        label={t('profile_twist_rate')}
                        uint={t('uint_inches_dash_turn')}
                        value={values.twistRate}
                        onChangeText={handleChange('twistRate')}
                        error={errors.twistRate}
                        touched={touched.twistRate}
                        onBlur={handleBlur('twistRate')}
                        background={colors.appBg}
                    />

                    <SelectInput
                        label={t('profile_twist_direction')}
                        background={colors.appBg}
                        chosenEl={twistDirectionState}
                        list={translateList}
                        setElem={val => setTwistDirectionState(val)}
                    />

                    <NumericInput
                        label={t('profile_scope_height')}
                        uint={t('uint_mm')}
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
