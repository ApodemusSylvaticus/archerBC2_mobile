import React, { useEffect, useMemo } from 'react';
import { AppContainer } from '@/components/container/appContainer';
import { EnvironmentParam, StableParam, WindParamColumn } from '@/components/envParamCard';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { useDevStatusStore } from '@/store/useDevStatusStore';

const ShotConditions: React.FC = () => {
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const { devStatus, actualProfile } = useDevStatusStore(state => ({
        devStatus: state.devStatus,
        actualProfile: state.actualProfile,
    }));
    useEffect(() => {
        coreProtobuf.getHostDevStatus();
    }, []);

    if (devStatus === null) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    if (actualProfile === null) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <AppContainer>
            <DefaultColumnContainer>
                <WindParamColumn />
                <EnvironmentParam />
                <StableParam />
            </DefaultColumnContainer>
        </AppContainer>
    );
};

export default ShotConditions;
