import React, { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Container, LinkEl } from '@/components/tabBar/tab/style';

interface ITab {
    isActive: boolean;
    href: string;
}

export const Tab: React.FC<PropsWithChildren<ITab>> = ({ children, isActive, href }) => {
    const { bottom } = useSafeAreaInsets();

    return (
        <LinkEl href={href} asChild>
            <Container isActive={isActive} additionalSpace={bottom}>
                {children}
            </Container>
        </LinkEl>
    );
};
