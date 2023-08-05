import React, { PropsWithChildren } from 'react';
import { Container, MockImg } from '@/components/tabBar/tab/style';
import { TextSemiBold12 } from '@/components/text/styled';

interface ITab {
    isActive: boolean;
}

export const Tab: React.FC<PropsWithChildren<ITab>> = ({ children, isActive }) => {
    return (
        <Container isActive={isActive}>
            <MockImg />
            <TextSemiBold12>{children}</TextSemiBold12>
        </Container>
    );
};
