import React from 'react';
import { isAvailableAsync, shareAsync } from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import { Profile } from '@/interface/profile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';

export const ShareButton: React.FC<Profile> = React.memo(profile => {
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const { t } = useTranslation();
    const createAndReturnTempJson = async () => {
        try {
            const tempDirectory = `${FileSystem.documentDirectory}temp/`;
            const fileName = `${profile.fileName.slice(0, -4)}.json`;
            const filePath = tempDirectory + fileName;

            await FileSystem.makeDirectoryAsync(tempDirectory, { intermediates: true });

            await FileSystem.writeAsStringAsync(filePath, JSON.stringify(profile), {
                encoding: FileSystem.EncodingType.UTF8,
            });

            return `${FileSystem.documentDirectory}temp/${fileName}`;
        } catch (error) {
            console.error('Error: creating and writing a temporary JSON file:', error);
            return null;
        }
    };

    const action = async () => {
        try {
            const uri = await createAndReturnTempJson();

            if (uri === null) {
                return;
            }

            shareAsync(uri);
        } catch (error) {
            console.error('Error: sharing JSON file:', error);
        }
    };

    const handleClick = async () => {
        const isAvailable = await isAvailableAsync();
        if (!isAvailable) {
            sendNotification({ msg: t('error_notification_not_available'), type: NotificationEnum.ERROR });
            return;
        }

        action();
    };

    return (
        <DefaultButton onPress={handleClick}>
            <Text20>{t('default_share')}</Text20>
        </DefaultButton>
    );
});
