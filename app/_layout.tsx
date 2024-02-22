import React, { useEffect } from 'react';
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
import { ProfileWorker } from '@/core/profileWorker';
import { ErrorBoundary } from '@/components/errorBoundary';
// eslint-disable-next-line import/no-extraneous-dependencies,import/order
import NetInfo from '@react-native-community/netinfo';
import { ReticlesCore } from '@/core/reticlesCore';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { useReticlesStore } from '@/store/useReticlesStore';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    useEffect(() => {
        const profileWorker = new ProfileWorker();
        profileWorker.loadProto();
    }, []);

    const { getDataFromStorage, theme, size, language, setIsWiFiConnected, serverHost, isDevMode } = useSettingStore(
        state => ({
            getDataFromStorage: state.getDataFromStorage,
            theme: state.theme,
            size: state.size,
            language: state.language,
            setIsWiFiConnected: state.setIsWiFiConnected,
            serverHost: state.serverHost,
            isDevMode: state.isDevMode,
        }),
    );

    const setIsTestModeActiveProfile = useActiveProfileStore(state => state.setIsTestMode);
    const setIsTestModeDevStatus = useDevStatusStore(state => state.setIsTestMode);
    const setIsTestModReticles = useReticlesStore(state => state.setIsTestMode);

    useEffect(() => {
        setIsTestModeActiveProfile(isDevMode);
        setIsTestModeDevStatus(isDevMode);
        setIsTestModReticles(isDevMode);
    }, [isDevMode]);

    // TODO isNecessary?
    useEffect(() => {
        // Initialization
        const reticleCore = new ReticlesCore();
        reticleCore.setHrefBase(serverHost);
    }, []);

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

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsWiFiConnected(state.type === 'wifi');
        });
        return unsubscribe;
    }, []);

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
