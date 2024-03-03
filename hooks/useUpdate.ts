import { useEffect, useMemo } from 'react';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { ProfileWorker } from '@/core/profileWorker';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';

export const useUpdateEnvParam = () => {
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (coreProtobuf.getActualServerApi !== '') {
                coreProtobuf.getHostDevStatus();
            }
        }, 5000);

        return () => clearTimeout(intervalId);
    }, []);
};

export const useUpdateActiveProfile = () => {
    const profileWorker = useMemo(() => new ProfileWorker(), []);
    const { activeProfile, setProfile, setProfileListServerData } = useActiveProfileStore(state => ({
        activeProfile: state.activeProfile,
        updateProfile: state.updateProfile,
        setProfile: state.setProfile,
        setProfileListServerData: state.setProfileListServerData,
    }));
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const profileListServerData = await profileWorker.getProfilesList();
            setProfileListServerData(profileListServerData);

            if (profileListServerData.profileDesc[profileListServerData.activeprofile].filePath === activeProfile) {
                const val = await profileWorker.getProfile(activeProfile);
                setProfile(activeProfile, val);
            }
        }, 1000000);

        return () => clearTimeout(intervalId);
    }, [activeProfile, profileWorker, setProfile, setProfileListServerData]);
};
