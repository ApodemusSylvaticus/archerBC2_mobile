import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IDescription } from '@/interface/profile';
import { DescriptionForm } from '@/components/forms/profileChange/descriptionForm';

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
