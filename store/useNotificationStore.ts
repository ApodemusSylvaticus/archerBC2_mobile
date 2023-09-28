import { create } from 'zustand';

export enum NotificationEnum {
    ERROR,
    WARNING,
    SUCCESS,
}
interface INotification {
    msg: string;
    type: NotificationEnum;
    id: number;
}

interface INotificationStore {
    counter: number;
    notificationList: INotification[];
    sendNotification: (data: Omit<INotification, 'id'>) => void;
    removeNotification: () => void;
}

export const useNotificationStore = create<INotificationStore>()(set => ({
    counter: 0,
    notificationList: [{ msg: 'pasta', type: NotificationEnum.SUCCESS, id: 1 }],
    sendNotification: data =>
        set(state => {
            const newList = [...state.notificationList, { msg: data.msg, type: data.type, id: state.counter }];
            return {
                notificationList: newList,
                counter: state.counter + 1,
            };
        }),
    removeNotification: () => set(state => ({ notificationList: state.notificationList.filter((_, id) => id !== 0) })),
}));
