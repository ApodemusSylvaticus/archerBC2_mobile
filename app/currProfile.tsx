import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AppContainer } from '@/components/container/appContainer';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { ProfileWorker } from '@/core/profileWorker';
import { Text20 } from '@/components/text/styled';
import { Profile } from '@/components/profile';
import { WithFileName } from '@/interface/helper';
import { IBullet, ICartridge, IDescription, IRiffle, IZeroing } from '@/interface/profile';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { DefaultButton, DeleteButton } from '@/components/button/style';
import { AreYouSureModal } from '../components/modals/specificModal/alertModal/areYouSure';
import { Loader } from '@/components/loader';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { useProfileStore } from '@/store/useProfileStore';
import { IDraggableListItem } from '@/store/useModalControllerStore';
import { DraggableDistanceListModalMemo } from '@/components/modals/draggebleDistanceList';

// TODO Ref
const SetHttp: React.FC = () => {
    const setFileList = useActiveProfileStore(state => state.setFileList);
    const { colors } = useTheme();
    const [http, setHttp] = useState('http://localhost:8080/');
    const handlePress = () => {
        const profileWorker = new ProfileWorker();
        profileWorker.setHrefBase(http);
        profileWorker.getFileList().then(res => setFileList(res));
    };

    return (
        <View style={{ display: 'flex', flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'center' }}>
            <DefaultInput
                label="Set http"
                value={http}
                onChangeText={setHttp}
                error=""
                touched={false}
                onBlur={() => undefined}
                background={colors.appBg}
            />
            <DefaultButton onPress={handlePress}>
                <Text20>Submit</Text20>
            </DefaultButton>
        </View>
    );
};

const Content: React.FC = () => {
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const importProfile = useProfileStore(state => state.importProfile);

    const { activeProfilesMap, activeProfile, setProfile, deleteProfile } = useActiveProfileStore(state => ({
        activeProfilesMap: state.activeProfilesMap,
        activeProfile: state.activeProfile,
        setProfile: state.getProfile,
        deleteProfile: state.deleteProfile,
    }));

    const { t } = useTranslation();

    const profileWorker = useMemo(() => new ProfileWorker(), []);

    const { rem } = useTheme();

    const val = activeProfilesMap[activeProfile];

    useEffect(() => {
        if (activeProfile === '' || activeProfilesMap[activeProfile] !== null) {
            return;
        }
        profileWorker.getProfile(activeProfile).then(value => setProfile(activeProfile, value));
    }, [activeProfilesMap, activeProfile, profileWorker, setProfile]);

    const handleChange = (
        data:
            | WithFileName<IZeroing>
            | WithFileName<IBullet>
            | WithFileName<ICartridge>
            | WithFileName<IRiffle>
            | WithFileName<IDescription>,
    ) => {
        const {
            switches,
            profileName,
            rTwist,
            twistDir,
            caliber,
            coefG1,
            coefG7,
            bcType,
            bLength,
            bWeight,
            zeroX,
            zeroY,
            cZeroPTemperature,
            cZeroAirTemperature,
            cZeroAirHumidity,
            cZeroAirPressure,
            cZeroWPitch,
            cZeroDistanceIdx,
            distances,
            cZeroTemperature,
            cTCoeff,
            cMuzzleVelocity,
            deviceUuid,
            bulletName,
            shortNameTop,
            cartridgeName,
            shortNameBot,
            userNote,
            bDiameter,
            scHeight,
            fileName,
        } = activeProfilesMap[activeProfile]!;

        profileWorker
            .saveChanges(activeProfile, {
                deviceUuid,
                fileName: data.fileName ?? fileName,
                profileName: data.profileName ?? profileName,
                userNote: data.userNote ?? userNote,
                cTCoeff: data.cTCoeff ?? cTCoeff,
                cMuzzleVelocity: data.cMuzzleVelocity ?? cMuzzleVelocity,
                cZeroTemperature: data.cZeroTemperature ?? cZeroTemperature,
                zeroY: data.zeroY ?? zeroY,
                cZeroPTemperature: data.cZeroPTemperature ?? cZeroPTemperature,
                cZeroAirTemperature: data.cZeroAirTemperature ?? cZeroAirTemperature,
                cZeroAirHumidity: data.cZeroAirHumidity ?? cZeroAirHumidity,
                cZeroAirPressure: data.cZeroAirPressure ?? cZeroAirPressure,
                cZeroWPitch: data.cZeroWPitch ?? cZeroWPitch,
                cZeroDistanceIdx: data.cZeroDistanceIdx ?? cZeroDistanceIdx,
                distances: data.distances ?? distances,
                twistDir: data.twistDir ?? twistDir,
                rTwist: data.rTwist ?? rTwist,
                bulletName: data.bulletName ?? bulletName,
                shortNameTop: data.shortNameTop ?? shortNameTop,
                cartridgeName: data.cartridgeName ?? cartridgeName,
                shortNameBot: data.shortNameBot ?? shortNameBot,
                bLength: data.bLength ?? bLength,
                bWeight: data.bWeight ?? bWeight,
                zeroX: data.zeroX ?? zeroX,
                bDiameter: data.bDiameter ?? bDiameter,
                switches: data.switches ?? switches,
                scHeight: data.scHeight ?? scHeight,
                bcType: data.bcType ?? bcType,
                caliber: data.caliber ?? caliber,
                coefRows: (data.bcType ?? bcType) === 'G1' ? data.coefG1 ?? coefG1 : data.coefG7 ?? coefG7,
            })
            .then(res => {
                if (res.ok) {
                    profileWorker.getProfile(activeProfile).then(value => {
                        sendNotification({ type: NotificationEnum.SUCCESS, msg: 'profile updated' });
                        setProfile(activeProfile, value);
                    });
                } else {
                    console.log(res);
                    sendNotification({ type: NotificationEnum.SUCCESS, msg: 'Smth go wrong' });
                }
            });
    };

    const closeModalHandler = () => {
        setIsAlertModalOpen(false);
    };

    const exportProfileHandler = () => {
        if (val) {
            importProfile(val);
            sendNotification({ msg: 'Profile added', type: NotificationEnum.SUCCESS });
        }
    };

    const handleAccept = () => {
        setIsAlertModalOpen(false);
        profileWorker
            .deleteFileButton(activeProfile)
            .then(() => {
                sendNotification({ msg: 'Profile deleted', type: NotificationEnum.SUCCESS });
                deleteProfile(activeProfile);
            })
            .catch(e => {
                console.log(e);
                sendNotification({ msg: 'Failed to delete profile', type: NotificationEnum.ERROR });
            });
    };

    const openModalHandler = () => {
        setIsAlertModalOpen(true);
    };

    const handleRefreshList = () => {
        profileWorker
            .serveRefreshList()
            .then(() => {
                sendNotification({ msg: 'List refreshed', type: NotificationEnum.SUCCESS });
                deleteProfile(activeProfile);
            })
            .catch(e => {
                console.log(e);
                sendNotification({ msg: 'Failed to refresh list', type: NotificationEnum.ERROR });
            });
    };

    const handleChangeDistances = (data: IDraggableListItem[]) => {
        const list: number[] = [];
        let zeroIdx: number = 0;
        data.forEach((el, index) => {
            if (el.isZeroDistance) {
                zeroIdx = index;
            }
            list.push(+el.title);
        });

        const {
            switches,
            profileName,
            rTwist,
            twistDir,
            caliber,
            coefG1,
            coefG7,
            bcType,
            bLength,
            bWeight,
            zeroX,
            zeroY,
            cZeroPTemperature,
            cZeroAirTemperature,
            cZeroAirHumidity,
            cZeroAirPressure,
            cZeroWPitch,
            cZeroTemperature,
            cTCoeff,
            cMuzzleVelocity,
            deviceUuid,
            bulletName,
            shortNameTop,
            cartridgeName,
            shortNameBot,
            userNote,
            bDiameter,
            scHeight,
            fileName,
        } = activeProfilesMap[activeProfile]!;

        profileWorker
            .saveChanges(activeProfile, {
                deviceUuid,
                fileName,
                profileName,
                userNote,
                cTCoeff,
                cMuzzleVelocity,
                cZeroTemperature,
                zeroY,
                cZeroPTemperature,
                cZeroAirTemperature,
                cZeroAirHumidity,
                cZeroAirPressure,
                cZeroWPitch,
                cZeroDistanceIdx: zeroIdx,
                distances: list,
                twistDir,
                rTwist,
                bulletName,
                shortNameTop,
                cartridgeName,
                shortNameBot,
                bLength,
                bWeight,
                zeroX,
                bDiameter,
                switches,
                scHeight,
                bcType,
                caliber,
                coefRows: bcType === 'G1' ? coefG1 : coefG7,
            })
            .then(res => {
                if (res.ok) {
                    profileWorker.getProfile(activeProfile).then(value => {
                        sendNotification({ type: NotificationEnum.SUCCESS, msg: 'profile updated' });
                        setProfile(activeProfile, value);
                    });
                } else {
                    console.log(res);
                    sendNotification({ type: NotificationEnum.SUCCESS, msg: 'Smth go wrong' });
                }
            });
    };

    if (activeProfile === '' || activeProfilesMap[activeProfile] === null) {
        return <Loader size={rem * 3.2} />;
    }

    return (
        <DefaultColumnContainer>
            <Profile
                {...val}
                isFileNameChangeable={false}
                setBullet={handleChange}
                setCartridge={handleChange}
                setDescription={handleChange}
                setRiffle={handleChange}
                setZeroing={handleChange}
                setDistances={handleChangeDistances}
            />

            <DefaultButton onPress={exportProfileHandler} style={{ marginTop: 16 }}>
                <Text20>{t('profile_export_this_to_all')}</Text20>
            </DefaultButton>

            <DefaultButton onPress={handleRefreshList} style={{ marginTop: 16 }}>
                <Text20>Server: refresh list</Text20>
            </DefaultButton>

            <DeleteButton onPress={openModalHandler} style={{ marginTop: 16 }}>
                <Text20>{t('profile_delete_profile')}</Text20>
            </DeleteButton>
            <AreYouSureModal
                question={t('profile_are_you_sure_delete')}
                isOpen={isAlertModalOpen}
                closeHandler={closeModalHandler}
                acceptHandler={handleAccept}
            />
        </DefaultColumnContainer>
    );
};

export const CurrProfile: React.FC = () => {
    return (
        <AppContainer>
            <SetHttp />
            <Content />
            <DraggableDistanceListModalMemo />
        </AppContainer>
    );
};

export default CurrProfile;
