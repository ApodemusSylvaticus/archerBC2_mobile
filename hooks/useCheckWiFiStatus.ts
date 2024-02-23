import { useCallback } from 'react';
import { useSettingStore } from '@/store/useSettingStore';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';

export const useCheckWiFiStatus = () => {
    const isWiFiConnected = useSettingStore(state => state.isWiFiConnected);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    return useCallback(() => {
        if (!isWiFiConnected) {
            sendNotification({ type: NotificationEnum.ERROR, msg: 'error_failed_connect_to_wifi' });
        }
        console.log('wifi work');
        return isWiFiConnected;
    }, [isWiFiConnected]);
};
