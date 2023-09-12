import React from 'react';
import { AppContainer } from '@/components/container/appContainer';
import { ParamColumn, WindParamColumn } from '@/components/envParamCard';
import { DefaultColumnContainer } from '@/components/container/defaultBox';

const ShotConditions: React.FC = () => {
    return (
        <AppContainer>
            <DefaultColumnContainer>
                <WindParamColumn />
                <ParamColumn />
            </DefaultColumnContainer>
        </AppContainer>
    );
};

export default ShotConditions;
