import React from 'react';
import { AppContainer } from '@/components/container/appContainer';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { ProfileTab } from '@/components/profile/profileTab';
import { useProfileStore } from '@/store/useProfileStore';

const CurrProfile: React.FC = () => {
    const profiles = useProfileStore(state => state.actualProfiles);

    return (
        <AppContainer>
            <DefaultColumnContainer>
                {profiles.map(el => (
                    <ProfileTab
                        id={el.id}
                        profileName={el.profileName}
                        cartridge={el.cartridgeName}
                        bullet={el.bulletName}
                        key={el.id}
                    />
                ))}
            </DefaultColumnContainer>
        </AppContainer>
    );
};

export default CurrProfile;
