import React from 'react';
import { Description } from '@/components/profile/components/description';
import { Rifle } from '@/components/profile/components/rifle';
import { Bullet } from '@/components/profile/components/bullet';
import { Reticles } from '@/components/profile/components/reticles';

export const Profile: React.FC = () => {
    return (
        <>
            <Description />
            <Rifle />
            <Bullet />
            <Reticles />
        </>
    );
};
