import React from 'react';
import { Profile } from '@/components/profile';
import { AppContainer } from '@/components/container/appContainer';

const CurrProfile: React.FC = () => {
    return (
        <AppContainer>
            <Profile />
        </AppContainer>
    );
};

export default CurrProfile;
