import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { ThemeProvider } from 'styled-components/native';
import { ClickOutsideProvider } from 'react-native-click-outside';
import { View } from 'react-native';
import { TabBar } from '@/components/tabBar';
import { ModalControllerWrapper } from '@/components/modals/modalControllerWrapper';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        'Lato-Bold': require('../assets/fonts/Lato-Bold.ttf'),
        'Lato-Light': require('../assets/fonts/Lato-Light.ttf'),
        'Lato-Medium': require('../assets/fonts/Lato-Medium.ttf'),
        'Lato-Regular': require('../assets/fonts/Lato-Regular.ttf'),
        'Lato-Semibold': require('../assets/fonts/Lato-Semibold.ttf'),
        ...FontAwesome.font,
    });

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
            activeTab: '#8BC34A',
            secondary: '#EEEEEE',
            error: '#B00020',
        },
    };

    return (
        <ClickOutsideProvider>
            <ThemeProvider theme={{ rem: 10, ...defaultTheme }}>
                <ModalControllerWrapper>
                    <View style={{ height: 50 }} />
                    <Stack>
                        <Stack.Screen name="profiles" />
                    </Stack>
                    <TabBar />
                </ModalControllerWrapper>
            </ThemeProvider>
        </ClickOutsideProvider>
    );
}
