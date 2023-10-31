import React, { PropsWithChildren } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import { DefaultAppContainer } from '@/components/container/defaultBox';
import { NotificationService } from '@/components/notification';
import { ModalControllerWrapper } from '@/components/modals/modalControllerWrapper';

export const AppContainer: React.FC<PropsWithChildren> = ({ children }) => {
    const { right, left } = useSafeAreaInsets();
    return (
        <ModalControllerWrapper>
            <ScrollView>
                <DefaultAppContainer right={right} left={left}>
                    {children}
                </DefaultAppContainer>
            </ScrollView>
            <NotificationService />
        </ModalControllerWrapper>
    );
};
