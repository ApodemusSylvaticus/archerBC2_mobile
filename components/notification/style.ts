import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { NotificationEnum } from '@/store/useNotificationStore';

export const Container = styled.View`
    position: absolute;
    display: flex;
    gap: 8px;
    left: 8px;
    bottom: 72px;
    z-index: 10000;
`;

export const NotificationContainer = Animated.createAnimatedComponent(styled.View<{
    notificationType: NotificationEnum;
}>`
    border-radius: 16px;
    padding: 4px 16px;
    position: relative;
    top: 0;
    left: 0;
    border: 1px solid;
    border-color: ${props => {
        switch (props.notificationType) {
            case NotificationEnum.ERROR:
                return props.theme.colors.error;
            case NotificationEnum.SUCCESS:
                return props.theme.colors.success;
            default:
                return props.theme.colors.success;
        }
    }};
    background: ${props => props.theme.colors.cardBg};
`);
