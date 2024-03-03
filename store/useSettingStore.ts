import { create } from 'zustand/esm';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AsyncStore } from '@/constant/asyncStore';
import { languageSimbolArray } from '@/i18n';
import { darkTheme, ITheme } from '@/constant/theme';

interface IUseSettingStore {
    language: string;
    setLanguage: (data: string) => void;
    isDevMode: boolean;
    swapDevMode: () => void;
    setTheme: (theme: ITheme) => void;
    size: number;
    setSize: (data: number) => void;
    theme: ITheme;
    serverHost: string;
    setServerHost: (serverHost: string) => void;
    isWiFiConnected: boolean;
    setIsWiFiConnected: (data: boolean) => void;

    getDataFromStorage: () => Promise<void>;
}

export const useSettingStore = create<IUseSettingStore>()(set => ({
    language: languageSimbolArray[0],
    serverHost: `192.168.1.117`,
    isWiFiConnected: false,
    isDevMode: false,
    swapDevMode: () => set(prev => ({ isDevMode: !prev.isDevMode })),
    setIsWiFiConnected: isWiFiConnected => set({ isWiFiConnected }),
    setLanguage: language =>
        set(() => {
            AsyncStorage.setItem(AsyncStore.language, JSON.stringify(language)).catch(console.log);
            return { language };
        }),
    setServerHost: serverHost => set({ serverHost }),
    theme: darkTheme,
    setTheme: theme =>
        set(() => {
            AsyncStorage.setItem(AsyncStore.theme, JSON.stringify(theme)).catch(console.log);
            return { theme };
        }),
    size: 10,
    setSize: size =>
        set(() => {
            AsyncStorage.setItem(AsyncStore.size, JSON.stringify(size)).catch(console.log);
            return { size };
        }),

    getDataFromStorage: async () => {
        try {
            const theme = await AsyncStorage.getItem(AsyncStore.theme);
            const language = await AsyncStorage.getItem(AsyncStore.language);
            const size = await AsyncStorage.getItem(AsyncStore.size);

            set({
                size: size ? JSON.parse(size) : 10,
                language: language ? JSON.parse(language) : languageSimbolArray[0],
                theme: theme ? JSON.parse(theme) : darkTheme,
            });
        } catch (e) {
            console.log(e);
        }
    },
}));
