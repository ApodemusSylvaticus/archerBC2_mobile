import React, { PropsWithChildren, useCallback, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RefreshControl, ScrollView } from 'react-native';
import { DefaultAppContainer } from '@/components/container/defaultBox';
import { NotificationService } from '@/components/notification';
import { ModalControllerWrapper } from '@/components/modals/modalControllerWrapper';

export const AppContainer: React.FC<PropsWithChildren<{ refreshFunc?: () => void }>> = ({ children, refreshFunc }) => {
    const { right, left } = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = useCallback(async () => {
        if (refreshFunc === undefined) {
            return;
        }
        setRefreshing(true);
        refreshFunc();
        setRefreshing(false);
    }, []);

    return (
        <ModalControllerWrapper>
            <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <DefaultAppContainer right={right} left={left}>
                    {children}
                </DefaultAppContainer>
            </ScrollView>
            <NotificationService />
        </ModalControllerWrapper>
    );
};
