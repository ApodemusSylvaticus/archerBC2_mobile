import React from 'react';
import { Profile } from '@/components/profile';
import { AppContainer } from '@/components/container/appContainer';
import { useProfileStore } from '@/store/useProfileStore';

const CurrProfile: React.FC = () => {
    const pr = useProfileStore(state => state.profiles);
    console.log(pr);

    return (
        <AppContainer>
            <Profile />
        </AppContainer>
    );
};

export default CurrProfile;
