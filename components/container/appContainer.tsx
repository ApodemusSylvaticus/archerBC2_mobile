import React, { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { DefaultAppContainer } from '@/components/container/defaultBox';

export const AppContainer: React.FC<PropsWithChildren> = ({ children }) => {
    const { right, left, top } = useSafeAreaInsets();
    return (
        <ScrollView>
            <DefaultAppContainer right={right} left={left} top={top}>
                {children}
            </DefaultAppContainer>
        </ScrollView>
    );
};
