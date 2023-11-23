import React from 'react';
import { AppContainer } from '@/components/container/appContainer';
import { ProfileTab } from '@/components/profile/profileTab';
import { useProfileStore } from '@/store/useProfileStore';
import { DefaultColumnContainer } from '@/components/container/defaultBox';

const Profiles: React.FC = () => {
    const profiles = useProfileStore(state => state.profiles);

    return (
        <AppContainer>
            <DefaultColumnContainer>
                {profiles.map(el => (
                    <ProfileTab {...el} key={el.fileName} />
                ))}
            </DefaultColumnContainer>
        </AppContainer>
    );
};

export default Profiles;
