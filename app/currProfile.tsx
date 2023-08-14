import React from 'react';
import { ScrollView } from 'react-native';
import { DefaultContainer } from '@/components/container/defaultBox';
import { Profile } from '@/components/profile';

const CurrProfile: React.FC = () => {
    return (
        <ScrollView>
            <DefaultContainer>
                <Profile />
            </DefaultContainer>
        </ScrollView>
    );
};

export default CurrProfile;
