import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText, SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IDescription } from '@/interface/profile';
import { useProfileStore } from '@/store/useProfileStore';
import { DefaultInput } from '@/components/Inputs/defaultInput';

const schema = object().shape({
    shortNameBot: string().required('Required').min(1).max(10, 'Too Long!'),
    bulletName: string().required('Required').min(1).max(15, 'Too Long!'),
    shortNameTop: string().required('Required').min(1).max(10, 'Too Long!'),
    cartridgeName: string().required('Required').min(1).max(15, 'Too Long!'),
    profileName: string().required('Required').min(1).max(15, 'Too Long!'),
});

export const DescriptionForm: React.FC<WithId<IDescription & { close: () => void }>> = ({
    shortNameBot,
    bulletName,
    shortNameTop,
    cartridgeName,
    profileName,
    id,
    userNote,
    close,
}) => {
    const inputValue = {
        shortNameBot,
        bulletName,
        shortNameTop,
        cartridgeName,
        profileName,
        userNote,
    };
    const setDescription = useProfileStore(state => state.setDescription);
    const { t } = useTranslation();

    const { colors } = useTheme();

    return (
        <Formik
            initialValues={inputValue}
            onSubmit={value => {
                setDescription({
                    id,
                    profileName: value.profileName,
                    userNote: value.userNote,
                    cartridgeName: value.cartridgeName,
                    bulletName: value.bulletName,
                    shortNameBot: value.shortNameBot,
                    shortNameTop: value.shortNameTop,
                });
                close();
            }}
            validationSchema={schema}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <>
                    <DefaultInput
                        label={t('profile_profile_name')}
                        value={values.profileName}
                        onChangeText={handleChange('profileName')}
                        error={errors.profileName}
                        touched={touched.profileName}
                        onBlur={handleBlur('profileName')}
                        background={colors.cardBg}
                    />

                    <DefaultInput
                        label={t('profile_top')}
                        value={values.shortNameTop}
                        onChangeText={handleChange('shortNameTop')}
                        error={errors.shortNameTop}
                        touched={touched.shortNameTop}
                        onBlur={handleBlur('shortNameTop')}
                        background={colors.cardBg}
                    />

                    <DefaultInput
                        label={t('profile_bottom')}
                        value={values.shortNameBot}
                        onChangeText={handleChange('shortNameBot')}
                        error={errors.shortNameBot}
                        touched={touched.shortNameBot}
                        onBlur={handleBlur('shortNameBot')}
                        background={colors.cardBg}
                    />

                    <DefaultInput
                        label={t('profile_cartridge_name')}
                        value={values.cartridgeName}
                        onChangeText={handleChange('cartridgeName')}
                        error={errors.cartridgeName}
                        touched={touched.cartridgeName}
                        onBlur={handleBlur('cartridgeName')}
                        background={colors.cardBg}
                    />

                    <DefaultInput
                        label={t('profile_bullet_name')}
                        value={values.bulletName}
                        onChangeText={handleChange('bulletName')}
                        error={errors.bulletName}
                        touched={touched.bulletName}
                        onBlur={handleBlur('bulletName')}
                        background={colors.cardBg}
                    />

                    <DefaultInput
                        label={t('profile_user_note')}
                        value={values.userNote}
                        onChangeText={handleChange('userNote')}
                        error={errors.userNote}
                        touched={touched.userNote}
                        onBlur={handleBlur('userNote')}
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
export const Description: React.FC<WithId<IDescription>> = ({
    shortNameBot,
    bulletName,
    shortNameTop,
    cartridgeName,
    profileName,
    id,
    userNote,
}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { t } = useTranslation();

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_description')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <DescriptionForm
                    profileName={profileName}
                    cartridgeName={cartridgeName}
                    bulletName={bulletName}
                    shortNameTop={shortNameTop}
                    shortNameBot={shortNameBot}
                    userNote={userNote}
                    close={() => setIsEditMode(false)}
                    id={id}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_profile_name')}</Text20>
                        <Text20>{profileName}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_top')}</Text20>
                        <Text20>{shortNameTop}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_bottom')}</Text20>
                        <Text20>{shortNameBot}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <TextSemiBold24>{t('profile_round')}</TextSemiBold24>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_cartridge_name')}</Text20>
                        <Text20>{cartridgeName}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_bullet_name')}</Text20>
                        <Text20>{bulletName}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_user_note')}</Text20>
                        <Text20>{userNote}</Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
