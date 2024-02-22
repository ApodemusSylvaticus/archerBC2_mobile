import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { useSettingStore } from '@/store/useSettingStore';
import { ProfileWorker } from '@/core/profileWorker';
import { useCheckWiFiStatus } from '@/hooks/useCheckWiFiStatus';

export const useA = () => {
    const serverApi = useSettingStore(state => state.serverHost);
    const { setAllFileListData, hardResetAllFileList } = useActiveProfileStore(state => ({
        setAllFileListData: state.setAllFileListData,
        hardResetAllFileList: state.hardResetAllFileList,
    }));
    const checkWiFi = useCheckWiFiStatus();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const { t } = useTranslation();
    const [shouldRetry, setShouldRetry] = useState(false);

    const profileWorker = useMemo(() => new ProfileWorker(), []);

    const helper = useCallback(async (dataServerApi: string, hardReset: boolean) => {
        if (!checkWiFi()) {
            setErrorMsg(t('error_failed_to_get_profile_data'));
            return;
        }

        setIsLoading(true);
        setErrorMsg('');
        profileWorker.setHrefBase(dataServerApi);

        try {
            const fileList = await profileWorker.getFileList();
            const profileList = await profileWorker.getProfilesList();
            if (hardReset) {
                hardResetAllFileList(fileList, profileList);
                return;
            }
            setAllFileListData(fileList, profileList);
        } catch {
            setErrorMsg(t('error_failed_to_get_profile_data'));
        } finally {
            setIsLoading(false);
            setShouldRetry(false);
        }
    }, []);

    useEffect(() => {
        if (shouldRetry) {
            helper(serverApi, shouldRetry);
            return;
        }

        if (profileWorker.getServerApi() !== serverApi) {
            helper(serverApi, false);
        }
    }, [serverApi, shouldRetry]);

    return { isLoading, errorMsg, retryHandler: () => setShouldRetry(true) };
};

export const useGetVelocityParam = () => {
    const { isLoading, errorMsg } = useA();
    const profileWorker = useMemo(() => new ProfileWorker(), []);
    const [isProfileLoading, setIsProfileLoading] = useState(false);
    const [profileErrorMsg, setProfileErrorMsg] = useState('');
    const { t } = useTranslation();
    const setProfile = useActiveProfileStore(state => state.setProfile);

    const activeProfile = useDevStatusStore(state => state.activeProfile);

    const { fileList, activeProfilesMap } = useActiveProfileStore(state => ({
        fileList: state.fileList,
        activeProfilesMap: state.activeProfilesMap,
    }));

    useEffect(() => {
        if (activeProfile === null) {
            return;
        }

        if (activeProfilesMap[activeProfile] !== null) {
            return;
        }
        setIsProfileLoading(true);

        profileWorker
            .getProfile(activeProfile)
            .then(value => setProfile(activeProfile, value))
            .catch(() => setProfileErrorMsg(t('error_failed_to_get_profile_data')))
            .finally(() => setIsProfileLoading(false));
    }, [activeProfilesMap, activeProfile, profileWorker, fileList, setProfile]);

    const profile = activeProfile && activeProfilesMap[activeProfile] ? activeProfilesMap[activeProfile] : null;
    return {
        velocityParam: profile
            ? {
                  cTCoeff: profile.cTCoeff,
                  cZeroTemperature: profile.cZeroPTemperature,
                  cMuzzleVelocity: profile.cMuzzleVelocity,
              }
            : null,
        isLoading: isLoading || isProfileLoading,
        errorMsg: errorMsg || profileErrorMsg,
    };
};
