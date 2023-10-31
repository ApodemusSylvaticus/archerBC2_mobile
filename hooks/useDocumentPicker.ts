import * as DocumentPicker from 'expo-document-picker';
import * as ExpoFileSystem from 'expo-file-system';
import { useTranslation } from 'react-i18next';
import { Profile } from '@/interface/profile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { useProfileStore } from '@/store/useProfileStore';

function isProfile(obj: object): obj is Profile {
    return (
        'deviceUuid' in obj &&
        'switches' in obj &&
        Array.isArray(obj.switches) &&
        obj.switches.every(
            (switchObj: any) =>
                'cIdx' in switchObj &&
                'distance' in switchObj &&
                'distanceFrom' in switchObj &&
                'reticleIdx' in switchObj &&
                'zoom' in switchObj,
        ) &&
        'caliber' in obj &&
        'scHeight' in obj &&
        'rTwist' in obj &&
        'twistDir' in obj &&
        'cMuzzleVelocity' in obj &&
        'cZeroTemperature' in obj &&
        'cTCoeff' in obj &&
        'profileName' in obj &&
        'cartridgeName' in obj &&
        'bulletName' in obj &&
        'shortNameTop' in obj &&
        'shortNameBot' in obj &&
        'fileName' in obj &&
        'userNote' in obj &&
        'bDiameter' in obj &&
        'bWeight' in obj &&
        'bLength' in obj &&
        'coefG1' in obj &&
        Array.isArray(obj.coefG1) &&
        'coefG7' in obj &&
        Array.isArray(obj.coefG7) &&
        'coefCustom' in obj &&
        Array.isArray(obj.coefCustom) &&
        'bcType' in obj &&
        'distances' in obj &&
        Array.isArray(obj.distances) &&
        'zeroX' in obj &&
        'zeroY' in obj &&
        'cZeroDistanceIdx' in obj &&
        'cZeroAirTemperature' in obj &&
        'cZeroAirPressure' in obj &&
        'cZeroAirHumidity' in obj &&
        'cZeroWPitch' in obj &&
        'cZeroPTemperature' in obj
    );
}

export function useDocumentPicker() {
    const { t } = useTranslation();

    const sendNotification = useNotificationStore(state => state.sendNotification);
    const importProfile = useProfileStore(state => state.importProfile);
    const pickDocument = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
            result.assets?.forEach(el => {
                ExpoFileSystem.readAsStringAsync(el.uri).then(res => {
                    const realRes = JSON.parse(res);

                    if (!isProfile(realRes)) {
                        sendNotification({ msg: t('error_invalid_profile'), type: NotificationEnum.ERROR });
                    }

                    importProfile(realRes);
                    sendNotification({ msg: t('default_profile_list_updated'), type: NotificationEnum.SUCCESS });
                });
            });
            // eslint-disable-next-line @typescript-eslint/no-shadow
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    };

    return pickDocument;
}
