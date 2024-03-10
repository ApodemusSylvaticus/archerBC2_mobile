import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import cloneDeep from 'lodash.clonedeep';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileWorker } from '@/core/profileWorker';
import { convertToServerProfile } from '@/helpers/convertProfile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { useSettingStore } from '@/store/useSettingStore';

export const useSendSelected = () => {
    const { t } = useTranslation();
    const serverApi = useSettingStore(state => state.serverHost);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const addNewProfiles = useActiveProfileStore(state => state.addNewProfiles);
    const { sendSelected, selectedProfiles, profiles } = useProfileStore(state => ({
        sendSelected: state.sendSelected,
        selectedProfiles: state.selectedProfiles,
        profiles: state.profiles,
    }));

    const profileWorker = useMemo(() => new ProfileWorker(), []);

    const handleRefreshList = useCallback(() => {
        return profileWorker
            .serveRefreshList()
            .then(() => {
                sendNotification({ msg: t('default_list_refreshed'), type: NotificationEnum.SUCCESS });
            })
            .catch(e => {
                console.log(e);
                sendNotification({ msg: t('error_failed_ref_list'), type: NotificationEnum.ERROR });
            });
    }, []);

    const handler = useCallback(async () => {
        try {
            setIsLoading(true);
            profileWorker.setHrefBase(serverApi);
            const filteredProfiles = profiles.filter(el => selectedProfiles.includes(el.fileName));
            const readyToSend = convertToServerProfile(filteredProfiles);
            const res = await profileWorker.sendNewProfiles(readyToSend);

            console.log(res);
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

            try {
                await handleRefreshList();
                const fileList = await profileWorker.getFileList();
                const profileList = await profileWorker.getProfilesList();

                const newFiltered = filteredProfiles.filter(el => !filter.includes(el.fileName));

                const newProfileList = cloneDeep(profileList);

                newFiltered.forEach(el => {
                    const index = newProfileList.profileDesc.findIndex(val => val.filePath === el.fileName);
                    if (index === -1) {
                        newProfileList.profileDesc.push({
                            shortNameBot: el.shortNameBot,
                            profileName: el.profileName,
                            filePath: el.fileName,
                            shortNameTop: el.shortNameTop,
                            cartridgeName: el.cartridgeName,
                        });
                        return;
                    }

                    newProfileList.profileDesc[index] = {
                        shortNameBot: el.shortNameBot,
                        profileName: el.profileName,
                        filePath: el.fileName,
                        shortNameTop: el.shortNameTop,
                        cartridgeName: el.cartridgeName,
                    };
                });

                await profileWorker.sendProfilesListData(newProfileList);

                addNewProfiles(newFiltered, fileList, newProfileList);
            } catch {
                sendNotification({ msg: t('error_failed_to_update_state'), type: NotificationEnum.ERROR });
            }
        } catch {
            sendNotification({ msg: t('error_failed_to_add_new_profile'), type: NotificationEnum.ERROR });
        } finally {
            sendSelected();
            setIsLoading(false);
        }
    }, [
        addNewProfiles,
        handleRefreshList,
        profileWorker,
        profiles,
        selectedProfiles,
        sendNotification,
        sendSelected,
        serverApi,
        t,
    ]);

    return {
        isLoading,
        sendSelected: handler,
    };
};
