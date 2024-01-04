import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { AppContainer } from '@/components/container/appContainer';
import { EnvironmentParam, WindParamColumn } from '@/components/envParamCard';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { useSettingStore } from '@/store/useSettingStore';
import { Loader } from '@/components/loader';
import { RetryWithErrorMsg } from '@/components/retry';
import { useUpdateEnvParam } from '@/hooks/useUpdate';

const Updater: React.FC = () => {
    useUpdateEnvParam();
    const { rem } = useTheme();

    const devStatus = useDevStatusStore(state => state.devStatus);

    if (devStatus === null) {
        return <Loader size={rem * 3.2} />;
    }

    return (
        <DefaultColumnContainer>
            <WindParamColumn />
            <EnvironmentParam />
        </DefaultColumnContainer>
    );
};
const ShotConditions: React.FC = () => {
    const { setDevStatus, setActiveProfile, devStatus, isTesting } = useDevStatusStore(state => ({
        setDevStatus: state.setDevStatus,
        setActiveProfile: state.setActiveProfile,
        devStatus: state.devStatus,
        isTesting: state.isTesting,
    }));
    const { t } = useTranslation();
    const { rem } = useTheme();
    const [shouldRetry, setShouldRetry] = useState(false);
    const [isLoading, setIsLoading] = useState(!devStatus);
    const [errorMsg, setErrorMsg] = useState('');

    const serverApi = useSettingStore(state => state.serverHost);

    const coreProtobuf = useMemo(() => {
        const protobuf = new CoreProtobuf();
        protobuf.setSetterParam({ setDevStatus, setActiveProfile, setIsLoading, setErrorMsg, t });
        return protobuf;
    }, []);

    useEffect(() => {
        if (isTesting) {
            return;
        }
        coreProtobuf.connect(serverApi);
    }, [serverApi]);

    useEffect(() => {
        if (shouldRetry) {
            coreProtobuf.connect(serverApi);
            setShouldRetry(false);
        }
    }, [serverApi, shouldRetry]);

    return (
        <AppContainer>
            {isLoading && <Loader size={rem * 3.2} />}
            {!isLoading && errorMsg !== '' && (
                <RetryWithErrorMsg retryHandler={() => setShouldRetry(true)} msg={errorMsg} />
            )}

            {!isLoading && errorMsg === '' && <Updater />}
        </AppContainer>
    );
};

export default ShotConditions;
