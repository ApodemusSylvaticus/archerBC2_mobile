import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { useSettingStore } from '@/store/useSettingStore';
import { ProfileWorker } from '@/core/profileWorker';
import { useCheckWiFiStatus } from '@/hooks/useCheckWiFiStatus';
import { CoreProtobuf } from '@/core/coreProtobuf';

export const useTableData = () => {
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
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const [isProfileLoading, setIsProfileLoading] = useState(false);

    const activeProfile = useDevStatusStore(state => state.activeProfile);

    useEffect(() => {
        if (activeProfile === null) {
            setIsProfileLoading(true);
            coreProtobuf.getHostProfile();
            return;
        }

        setIsProfileLoading(false);
    }, [activeProfile, coreProtobuf]);

    console.log(activeProfile);

    return {
        velocityParam: activeProfile
            ? {
                  cTCoeff: activeProfile.cTCoeff,
                  cZeroTemperature: activeProfile.cZeroPTemperature,
                  cMuzzleVelocity: activeProfile.cMuzzleVelocity,
              }
            : null,
        isLoading: isProfileLoading,
    };
};
