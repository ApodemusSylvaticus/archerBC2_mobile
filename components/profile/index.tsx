import React from 'react';
import { Description } from '@/components/profile/components/description';
import { Rifle } from '@/components/profile/components/rifle';
import { Bullet } from '@/components/profile/components/bullet';
import { Reticles } from '@/components/profile/components/reticles';
import { DefaultColumnContainer } from '@/components/container/defaultBox';

export const Profile: React.FC = () => {
    return (
        <DefaultColumnContainer>
            <Rifle />
            <Bullet />
            <Reticles />
            <Description />
        </DefaultColumnContainer>
    );
};
