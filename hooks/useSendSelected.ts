import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash.clonedeep';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileWorker } from '@/core/profileWorker';
import { convertToServerProfile } from '@/helpers/convertProfile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';

export const useSendSelected = () => {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const { sendSelected, selectedProfiles, profiles } = useProfileStore(state => ({
        sendSelected: state.sendSelected,
        selectedProfiles: state.selectedProfiles,
        profiles: state.profiles,
    }));

    const profileWorker = useMemo(() => new ProfileWorker(), []);

    const handler = useCallback(async () => {
        const filteredProfiles = profiles.filter(el => selectedProfiles.includes(el.fileName));
        const readyToSend = convertToServerProfile(filteredProfiles);
        setIsLoading(true);
        const res = await profileWorker.sendNewProfiles(readyToSend);
        const filter = res.filter(r => !r.ok).map(r => r.url.split('?filename=')[1]);
        if (filter.length) {
            // TODO: fix
            const brokenResProfiles = filter.join(', ');
            sendNotification({
                msg: `Profiles: ${brokenResProfiles} not be added`,
                type: NotificationEnum.ERROR,
            });
        } else {
            sendNotification({ msg: t('default_profile_added'), type: NotificationEnum.SUCCESS });
        }

        const list = await profileWorker.getProfilesList();
        const newProfileDesc = cloneDeep(list.profileDesc);
        const sendedProfiles = filteredProfiles.filter(el => !filter.includes(el.fileName));
        newProfileDesc.map(el => {
            const profile = sendedProfiles.find(val => val.fileName === el.filePath);
            if (profile) {
                return {
                    profileName: profile.profileName,
                    cartridgeName: profile.cartridgeName,
                    shortNameTop: profile.shortNameTop,
                    shortNameBot: profile.shortNameBot,
                    filePath: profile.fileName,
                };
            }
            return el;
        });
        sendedProfiles.forEach(el => {
            const index = newProfileDesc.findIndex(val => val.filePath === el.fileName);
            if (index === -1) {
                newProfileDesc.push({
                    profileName: el.profileName,
                    cartridgeName: el.cartridgeName,
                    shortNameTop: el.shortNameTop,
                    shortNameBot: el.shortNameBot,
                    filePath: el.fileName,
                });
                return;
            }

            newProfileDesc[index] = {
                profileName: el.profileName,
                cartridgeName: el.cartridgeName,
                shortNameTop: el.shortNameTop,
                shortNameBot: el.shortNameBot,
                filePath: el.fileName,
            };
        });

        profileWorker
            .sendProfilesListData({ profileDesc: newProfileDesc, activeprofile: list.activeprofile })
            .catch(() =>
                sendNotification({
                    msg: t('error_failed_to_update_profile_list'),
                    type: NotificationEnum.ERROR,
                }),
            );
        setIsLoading(false);
        sendSelected();
    }, [profileWorker, profiles, selectedProfiles, sendNotification, sendSelected, t]);

    return {
        isLoading,
        sendSelected: handler,
    };
};
