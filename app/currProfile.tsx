import React from 'react';
import { ScrollView } from 'react-native';
import { DefaultContainer } from '@/components/container/defaultBox';
import { Profile } from '@/components/profile';
import { useProfileStore } from '@/store/useProfileStore';

const CurrProfile: React.FC = () => {
    const profileStore = useProfileStore();
    console.log('profileStore', profileStore);
    return (
        <ScrollView>
            <DefaultContainer>
                <Profile />
            </DefaultContainer>
        </ScrollView>
    );
};

export default CurrProfile;
