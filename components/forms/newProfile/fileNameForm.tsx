import { Formik } from 'formik';
import React, { useMemo } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultRow } from '@/components/container/defaultBox';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { IForm } from '@/interface/form';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';
import { isAllTouched } from '@/helpers/isAllTached';
import { useProfileStore } from '@/store/useProfileStore';

export const FileNameForm: React.FC<IForm> = ({ goForward, goBack }) => {
    const { fileNameFormSchema } = useValidationSchema();
    const { fileName, setFileName, description } = useNewProfileStore(state => ({
        fileName: state.fileName,
        setFileName: state.setFileName,
        description: state.description,
    }));
    const { t } = useTranslation();
    const { rem, colors } = useTheme();

    const profiles = useProfileStore(state => state.profiles);

    const profileFileNameList = useMemo(() => {
        return profiles.map(el => el.fileName);
    }, [profiles]);

    const initialValue = useMemo(() => {
        const formatedCartridgeName = description.cartridge
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .slice(0, 8);

        const formatedBulletName = description.bullet
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .slice(0, 8);
        let str = `${formatedCartridgeName}_${formatedBulletName}`;
        while (profileFileNameList.includes(`${str}.a7p`)) {
            str += '1';
        }
        return { fileName: fileName || str };
    }, [fileName, description]);

    return (
        <Formik
            initialValues={initialValue}
            onSubmit={value => {
                setFileName(value.fileName);
                goForward();
            }}
            validationSchema={fileNameFormSchema}>
            {({ touched, handleChange, handleBlur, handleSubmit, values, errors, isValid }) => (
                <>
                    <DefaultRow>
                        <DefaultInput
                            label={t('profile_file_name')}
                            value={values.fileName}
                            onChangeText={handleChange('fileName')}
                            error={errors.fileName}
                            touched={touched.fileName}
                            onBlur={handleBlur('fileName')}
                            background={colors.appBg}
                        />
                    </DefaultRow>
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
