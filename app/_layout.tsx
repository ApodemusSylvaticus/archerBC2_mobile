import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Slot, SplashScreen } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TabBar } from '@/components/tabBar';
import { ModalControllerWrapper } from '@/components/modals/modalControllerWrapper';
import { useProfileStore } from '@/store/useProfileStore';
import { Header } from '@/components/header';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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

    if (!loaded) {
        return null;
    }

    const defaultTheme = {
        colors: {
            appBg: '#212121',
            cardBg: '#616161',
            primary: '#E0E0E0',
            l1ActiveEl: '#757575',
            l2ActiveEl: '#D9D9D9',
            activeTab: '#63A375',
            secondary: '#EEEEEE',
            error: '#B00020',
        },
    };

    return (
        <SafeAreaProvider>
            <ClickOutsideProvider>
                <ThemeProvider theme={{ rem: 10, ...defaultTheme }}>
                    <ModalControllerWrapper>
                        <Header />
                        <Slot />
                        <TabBar />
                    </ModalControllerWrapper>
                </ThemeProvider>
            </ClickOutsideProvider>
        </SafeAreaProvider>
    );
}
