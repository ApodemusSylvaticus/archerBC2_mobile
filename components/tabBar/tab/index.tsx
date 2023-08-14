import React, { PropsWithChildren } from 'react';
import { Container, LinkEl, MockImg } from '@/components/tabBar/tab/style';
import { TextSemiBold12 } from '@/components/text/styled';

interface ITab {
    isActive: boolean;
    href: string;
}

export const Tab: React.FC<PropsWithChildren<ITab>> = ({ children, isActive, href }) => {
    return (
        <LinkEl href={href} asChild>
            <Container isActive={isActive}>
                <MockImg />
                <TextSemiBold12>{children}</TextSemiBold12>
            </Container>
        </LinkEl>
    );
};
