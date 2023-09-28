import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useTheme } from 'styled-components/native';

interface LoaderProps {
    size: number;
}

export const Loader: React.FC<LoaderProps> = ({ size }) => {
    const { colors } = useTheme();
    const shift1 = useSharedValue(0);

    const shift2 = useSharedValue(0);

    const shift3 = useSharedValue(0);

    const animatedStyle1 = useAnimatedStyle(() => ({
        transform: [{ translateY: shift1.value }],
    }));

    const animatedStyle2 = useAnimatedStyle(() => ({
        transform: [{ translateY: shift2.value }],
    }));

    const animatedStyle3 = useAnimatedStyle(() => ({
        transform: [{ translateY: shift3.value }],
    }));

    useEffect(() => {
        shift1.value = withSequence(
            withTiming(size / 2, { duration: 1000 }),
            withRepeat(
                withTiming(-size / 2, {
                    duration: 2000,
                }),
                -1,
                true,
            ),
        );

        shift2.value = withDelay(
            400,
            withSequence(
                withTiming(size / 2, { duration: 1000 }),
                withRepeat(
                    withTiming(-size / 2, {
                        duration: 2000,
                    }),
                    -1,
                    true,
                ),
            ),
        );

        shift3.value = withDelay(
            800,
            withSequence(
                withTiming(size / 2, { duration: 1000 }),
                withRepeat(
                    withTiming(-size / 2, {
                        duration: 2000,
                    }),
                    -1,
                    true,
                ),
            ),
        );
    }, []);

    return (
        <View
            style={{
                display: 'flex',
                width: '100%',
                flexDirection: 'row',
                marginTop: size,
                marginBottom: size,
                gap: 4,
                justifyContent: 'center',
            }}>
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        backgroundColor: colors.activeTab,
                        borderRadius: size / 2,
                    },
                    animatedStyle1,
                ]}
            />
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        backgroundColor: colors.activeTab,
                        borderRadius: size / 2,
                    },
                    animatedStyle2,
                ]}
            />
            <Animated.View
                style={[
                    {
                        width: size,
                        height: size,
                        backgroundColor: colors.activeTab,
                        borderRadius: size / 2,
                    },
                    animatedStyle3,
                ]}
            />
        </View>
    );
};
