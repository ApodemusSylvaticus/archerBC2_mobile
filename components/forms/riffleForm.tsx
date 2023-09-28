import React, { useState } from 'react';
import { Formik } from 'formik';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultInput } from '../Inputs/defaultInput';
import { SelectInput } from '@/components/Inputs/select/select';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { isAllTouched } from '@/helpers/isAllTached';
import { IForm, RiffleProfileFormProps } from '@/interface/form';
import { NumericInput } from '@/components/Inputs/numericInput';
import { DefaultFormNavigation } from '@/components/forms/newProfile/defaultFormNavigation';
import { SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';

export const RiffleForm: React.FC<RiffleProfileFormProps> = ({ riffle, onSubmit, navigation, labelBg }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { riffleSchema } = useValidationSchema();

    const list = ['LEFT', 'RIGHT'] as const;

    const translateList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

    const [twistDirectionState, setTwistDirectionState] = useState(list.findIndex(el => el === riffle.twistDir));

    return (
        <Formik
            initialValues={riffle}
            onSubmit={({ rTwist, scHeight, caliber, fileName }) => {
                onSubmit({
                    twistDir: list[twistDirectionState],
                    rTwist,
                    scHeight,
                    fileName,
                    caliber,
                });
            }}
            validationSchema={riffleSchema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_caliber')}
                            value={values.caliber}
                            onChangeText={handleChange('caliber')}
                            error={errors.caliber}
                            touched={touched.caliber}
                            onBlur={handleBlur('caliber')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <NumericInput
                            label={t('profile_twist_rate')}
                            uint={t('uint_inches_dash_turn')}
                            value={values.rTwist}
                            onChangeText={handleChange('rTwist')}
                            error={errors.rTwist}
                            touched={touched.rTwist}
                            onBlur={handleBlur('rTwist')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    <SelectInput
                        label={t('profile_twist_direction')}
                        background={labelBg}
                        chosenEl={twistDirectionState}
                        list={translateList}
                        setElem={val => setTwistDirectionState(val)}
                    />
                    <DefaultRow>
                        <NumericInput
                            label={t('profile_scope_height')}
                            uint={t('uint_mm')}
                            value={values.scHeight}
                            onChangeText={handleChange('scHeight')}
                            error={errors.scHeight}
                            touched={touched.scHeight}
                            onBlur={handleBlur('scHeight')}
                            background={labelBg}
                        />
                    </DefaultRow>

                    {navigation.type === 'V1' && (
                        <DefaultFormNavigation
                            goBackAction={navigation.goBack}
                            goBackButtonColor={colors.primary}
                            goForwardAction={handleSubmit}
                            goForwardButtonColor={
                                isAllTouched(values) && isValid ? colors.activeTab : colors.l1ActiveEl
                            }
                        />
                    )}
                    {navigation.type === 'V2' && (
                        <SubmitButton
                            onPress={() => {
                                console.log(errors);
                                if (isValid) {
                                    handleSubmit();
                                }
                            }}>
                            <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                        </SubmitButton>
                    )}
                </>
            )}
        </Formik>
    );
};

export const NewRiffleForm: React.FC<IForm> = ({ goBack, goForward }) => {
    const { riffle, setRiffle } = useNewProfileStore(state => ({
        riffle: state.riffle,
        setRiffle: state.setRiffle,
    }));
    const { colors } = useTheme();

    return (
        <RiffleForm
            riffle={{ ...riffle, fileName: 'crunch' }}
            onSubmit={({ twistDir, caliber, scHeight, rTwist }) => {
                setRiffle({ twistDir, caliber, scHeight, rTwist });
                goForward();
            }}
            labelBg={colors.appBg}
            navigation={{ type: 'V1', goBack }}
        />
    );
};
