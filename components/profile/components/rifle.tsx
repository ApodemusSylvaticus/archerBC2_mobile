import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { number, object, string } from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { IRiffle } from '@/interface/profile';
import { WithId } from '@/interface/helper';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { NumericInput } from '@/components/Inputs/numericInput';
import { SelectInput } from '@/components/Inputs/select/select';
import { useProfileStore } from '@/store/useProfileStore';

const schema = object().shape({
    caliber: string().required('Required').max(50, 'Too Long!').min(1),
    rTwist: number().required('Required').min(0).max(100),
    scHeight: number().required('Required').min(-5000).max(5000),
});

// TODO: unite with another rifle form
export const RifleForm: React.FC<WithId<IRiffle & { close: () => void }>> = ({
    scHeight,
    rTwist,
    twistDir,
    caliber,
    id,
    close,
}) => {
    const inputValue = { scHeight: scHeight.toString(), rTwist: rTwist.toString(), caliber };
    const setProfileRifle = useProfileStore(state => state.setProfileRifle);
    const { t } = useTranslation();

    const list = ['left', 'right'] as const;
    const translatedList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

    const { colors } = useTheme();

    const [twistDirectionState, setTwistDirectionState] = useState(list.findIndex(el => el === twistDir));
    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                setProfileRifle({
                    id,
                    rTwist: +value.rTwist,
                    scHeight: +value.scHeight,
                    twistDir: list[twistDirectionState],
                    caliber: value.caliber,
                });
                close();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultInput
                        label={t('profile_calibre')}
                        value={values.caliber}
                        onChangeText={handleChange('caliber')}
                        error={errors.caliber}
                        touched={touched.caliber}
                        onBlur={handleBlur('caliber')}
                        background={colors.cardBg}
                    />

                    <SelectInput
                        label={t('profile_twist_direction')}
                        background={colors.cardBg}
                        chosenEl={twistDirectionState}
                        list={translatedList}
                        zIndex={10}
                        setElem={val => setTwistDirectionState(val)}
                    />

                    <NumericInput
                        label={t('profile_twist_rate')}
                        uint="inches/turn"
                        value={values.rTwist}
                        onChangeText={handleChange('rTwist')}
                        error={errors.rTwist}
                        touched={touched.rTwist}
                        onBlur={handleBlur('rTwist')}
                        background={colors.cardBg}
                    />

                    <NumericInput
                        label={t('profile_scope_height')}
                        uint="mm"
                        value={values.scHeight}
                        onChangeText={handleChange('scHeight')}
                        error={errors.scHeight}
                        touched={touched.scHeight}
                        onBlur={handleBlur('scHeight')}
                        background={colors.cardBg}
                    />
                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};

export const Rifle: React.FC<WithId<IRiffle>> = ({ scHeight, rTwist, twistDir, caliber, id }) => {
    const { t } = useTranslation();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const list = ['left', 'right'] as const;
    const index = list.findIndex(el => el === twistDir);
    const translatedList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_riffle')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <RifleForm
                    close={() => setIsEditMode(false)}
                    caliber={caliber}
                    scHeight={scHeight}
                    rTwist={rTwist}
                    twistDir={twistDir}
                    id={id}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_calibre')}</Text20>
                        <Text20>{caliber}</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_twist_direction')}</Text20>
                        <Text20>{translatedList[index]}</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_twist_rate')}</Text20>
                        <Text20>{rTwist} inches/turn</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_scope_height')}</Text20>
                        <Text20>{scHeight} mm</Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
