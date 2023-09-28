import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { SubmitButton, SubmitButtonText } from '@/components/profile/components/style';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { DefaultRow } from '@/components/container/defaultBox';
import { DescriptionProfileFormProps } from '@/interface/form';

export const DescriptionForm: React.FC<DescriptionProfileFormProps> = ({
    description,
    onSubmit,
    close,
    isFileNameChangeable,
}) => {
    const { t } = useTranslation();
    const { fullDescriptionSchema } = useValidationSchema();
    const schema = fullDescriptionSchema(description.fileName);
    const { colors } = useTheme();
    return (
        <Formik
            initialValues={description}
            onSubmit={value => {
                onSubmit({
                    prevFileName: description.fileName,
                    fileName: value.fileName,
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
                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_profile_name')}
                            value={values.profileName}
                            onChangeText={handleChange('profileName')}
                            error={errors.profileName}
                            touched={touched.profileName}
                            onBlur={handleBlur('profileName')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_top')}
                            value={values.shortNameTop}
                            onChangeText={handleChange('shortNameTop')}
                            error={errors.shortNameTop}
                            touched={touched.shortNameTop}
                            onBlur={handleBlur('shortNameTop')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_bottom')}
                            value={values.shortNameBot}
                            onChangeText={handleChange('shortNameBot')}
                            error={errors.shortNameBot}
                            touched={touched.shortNameBot}
                            onBlur={handleBlur('shortNameBot')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_cartridge_name')}
                            value={values.cartridgeName}
                            onChangeText={handleChange('cartridgeName')}
                            error={errors.cartridgeName}
                            touched={touched.cartridgeName}
                            onBlur={handleBlur('cartridgeName')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_bullet_name')}
                            value={values.bulletName}
                            onChangeText={handleChange('bulletName')}
                            error={errors.bulletName}
                            touched={touched.bulletName}
                            onBlur={handleBlur('bulletName')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            disabled={!isFileNameChangeable}
                            label={t('profile_file_name')}
                            value={values.fileName}
                            onChangeText={handleChange('fileName')}
                            error={errors.fileName}
                            touched={touched.fileName}
                            onBlur={handleBlur('fileName')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_user_note')}
                            value={values.userNote}
                            onChangeText={handleChange('userNote')}
                            error={errors.userNote}
                            touched={touched.userNote}
                            onBlur={handleBlur('userNote')}
                            background={colors.cardBg}
                        />
                    </DefaultRow>

                    <SubmitButton onPress={() => isValid && handleSubmit()}>
                        <SubmitButtonText>{t('default_apply_button')}</SubmitButtonText>
                    </SubmitButton>
                </>
            )}
        </Formik>
    );
};
