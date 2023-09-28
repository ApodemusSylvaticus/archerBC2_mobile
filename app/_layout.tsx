import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Alert, I18nManager, Platform, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TabBar } from '@/components/tabBar';
import { useProfileStore } from '@/store/useProfileStore';
import { Header } from '@/components/header';
import '@/i18n/index';
import { useSettingStore } from '@/store/useSettingStore';
import { languageArray } from '@/i18n';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { ProfileWorker } from '@/core/profileWorker';
import { ErrorBoundary } from '@/components/errorBoundary';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [wsMsg, setWsMsg] = useState(null);
    const { setDevStatus, getActualProfile } = useDevStatusStore(
        (state: { setDevStatus: any; getActualProfile: any }) => ({
            setDevStatus: state.setDevStatus,
            getActualProfile: state.getActualProfile,
        }),
    );

    useEffect(() => {
        const coreProtobuf = new CoreProtobuf(setWsMsg, getActualProfile);
        console.log(coreProtobuf);
    }, []);

    useEffect(() => {
        const profileWorker = new ProfileWorker();
        profileWorker.loadProto();
    }, []);

    useEffect(() => {
        if (wsMsg) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDevStatus(wsMsg);
        }
    }, [setDevStatus, wsMsg]);

    const { getDataFromStorage, theme, size, language } = useSettingStore(state => ({
        getDataFromStorage: state.getDataFromStorage,
        theme: state.theme,
        size: state.size,
        language: state.language,
    }));
    const { i18n } = useTranslation();
    const getProfileFromStore = useProfileStore(state => state.getProfileFromStore);
    const [loaded, error] = useFonts({
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Medium': require('../assets/fonts/Lato-Medium.ttf'),
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        ...FontAwesome.font,
    });

    useEffect(() => {
        getProfileFromStore().catch(console.log);
    }, [getProfileFromStore]);

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        getDataFromStorage();
    }, [getDataFromStorage]);

    useEffect(() => {
        if (language !== i18n.language) {
            i18n.changeLanguage(language);
            I18nManager.forceRTL(!languageArray.find(el => el.simbol === language)!.isLTR);
            // TODO set normal alert
            Alert.alert(
                'Reload this page',
                'Please reload this page to change the UI direction! ' +
                    'All examples in this app will be affected. ' +
                    'Check them out to see what they look like in RTL layout.',
            );
        }
    }, [i18n, language]);

    if (!loaded) {
        return null;
    }

    if (Platform.OS === 'web') {
        return (
            <View style={{ flex: 1, backgroundColor: theme.colors.appBg, width: '100%', height: '100%' }}>
                <SafeAreaProvider>
                    <ClickOutsideProvider>
                        <ThemeProvider theme={{ rem: size, ...theme }}>
                            <Header />
                            <Slot />
                            <TabBar />
                        </ThemeProvider>
                    </ClickOutsideProvider>
                </SafeAreaProvider>
            </View>
        );
    }

    return (
        <ErrorBoundary>
            <GestureHandlerRootView
                style={{ flex: 1, backgroundColor: theme.colors.appBg, width: '100%', height: '100%' }}>
                <SafeAreaProvider>
                    <ClickOutsideProvider>
                        <ThemeProvider theme={{ rem: size, ...theme }}>
                            <Header />
                            <Slot />
                            <TabBar />
                        </ThemeProvider>
                    </ClickOutsideProvider>
                </SafeAreaProvider>
            </GestureHandlerRootView>
        </ErrorBoundary>
    );
}
