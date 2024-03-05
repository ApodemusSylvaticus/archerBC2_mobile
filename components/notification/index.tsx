import React, { useEffect } from 'react';
import { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Container, NotificationContainer } from '@/components/notification/style';
import { Text20 } from '@/components/text/styled';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';

interface NotificationProps {
    msg: string;
    type: NotificationEnum;
}
export const Notification: React.FC<NotificationProps> = ({ msg, type }) => {
    const removeNotification = useNotificationStore(state => state.removeNotification);
    const opacityShared = useSharedValue(0);
    const positionLeftShared = useSharedValue(-200);
    const positionTopShared = useSharedValue(100);

    const animatedStyle = useAnimatedStyle(() => ({
        opacity: opacityShared.value,
        left: positionLeftShared.value,
        top: positionTopShared.value,
    }));

    useEffect(() => {
        opacityShared.value = withTiming(1, {
            duration: 600,
        });
        positionLeftShared.value = withSpring(0);
        positionTopShared.value = withSpring(0);

        setTimeout(() => {
            opacityShared.value = withTiming(0, {
                duration: 600,
            });
            positionLeftShared.value = withSpring(-200);
            positionTopShared.value = withSpring(100);

            setTimeout(() => {
                removeNotification();
            }, 600);
        }, 5000);
    }, []);

    return (
        <NotificationContainer style={animatedStyle} notificationType={type}>
            <Text20>{msg}</Text20>
        </NotificationContainer>
    );
};

export const NotificationService: React.FC = () => {
    const notificationList = useNotificationStore(state => state.notificationList);

    return (
        <Container>
            {notificationList.map(({ id, msg, type }) => (
                <Notification key={id} type={type} msg={msg} />
            ))}
        </Container>
    );
};
