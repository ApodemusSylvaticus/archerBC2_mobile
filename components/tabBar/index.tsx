import React from 'react';
import { Tab } from '@/components/tabBar/tab';
import { Container } from '@/components/tabBar/style';

export const TabBar: React.FC = () => {
    const arr = ['Curr Profile', 'Envi', 'Profiles', 'Reticles', 'Setting'];

    return (
        <Container>
            {arr.map(el => (
                <Tab isActive={false} key={el}>
                    {el}
                </Tab>
            ))}
        </Container>
    );
};
