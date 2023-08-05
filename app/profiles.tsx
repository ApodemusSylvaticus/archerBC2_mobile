import React from 'react';
import { DefaultContainer } from '@/components/container/defaultBox';
import { ProfileTab, IProfileTab } from '@/components/profile/profileTab';
import { Profile } from '@/components/profile';

const Profiles: React.FC = () => {
    const mockData: IProfileTab[] = [
        {
            cartridge: 'cartridge name',
            bullet: 'bullet name',
            profileName: 'Profile name 1',
        },
        {
            cartridge: 'cartridge name',
            bullet: 'bullet name',
            profileName: 'Profile name 2',
        },
        {
            cartridge: 'cartridge name',
            bullet: 'bullet name',
            profileName: 'Profile name 3',
        },
        {
            cartridge: 'cartridge name',
            bullet: 'bullet name',
            profileName: 'Profile name 4',
        },
    ];

    return (
        <DefaultContainer>
            {mockData.map(el => (
                <ProfileTab
                    bullet={el.bullet}
                    profileName={el.profileName}
                    cartridge={el.cartridge}
                    key={el.profileName}
                />
            ))}
            <Profile />
        </DefaultContainer>
    );
};

export default Profiles;
