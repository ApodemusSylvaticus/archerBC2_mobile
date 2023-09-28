import { useCallback, useMemo, useState } from 'react';
import { useProfileStore } from '@/store/useProfileStore';
import { ProfileWorker } from '@/core/profileWorker';
import { convertToServerProfile } from '@/helpers/convertProfile';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';

export const useSendSelected = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const { setFileList, fileList } = useActiveProfileStore(state => ({
        fileList: state.fileList,
        setFileList: state.setFileList,
    }));
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
            const brokenResProfiles = filter.join(', ');
            sendNotification({
                msg: `Profiles: ${brokenResProfiles} not be added`,
                type: NotificationEnum.ERROR,
            });
        } else {
            sendNotification({ msg: 'Profiles added', type: NotificationEnum.SUCCESS });
        }
        setIsLoading(false);
        sendSelected();
        const newList = new Set([
            ...filteredProfiles.map(el => el.fileName),
            ...fileList.filter(el => !filter.includes(el)),
        ]);
        setFileList([...newList]);
    }, [fileList, profileWorker, profiles, selectedProfiles, sendNotification, sendSelected, setFileList]);

    return {
        isLoading,
        sendSelected: handler,
    };
};
