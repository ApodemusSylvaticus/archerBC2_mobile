import React, { PropsWithChildren, useEffect, useRef } from 'react';
import { useTheme } from 'styled-components/native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { TextSemiBold24 } from '@/components/text/styled';
import { Container } from '@/components/button/longPressButton/style';

export const LongPressButton: React.FC<PropsWithChildren<{ handleLongPress: () => void; time: number }>> = ({
    handleLongPress,
    time,
    children,
}) => {
    const { colors } = useTheme();
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const borderTWidth = useSharedValue('0%');
    const borderLWidth = useSharedValue('0%');
    const borderBWidth = useSharedValue('0%');
    const borderRWidth = useSharedValue('0%');

    const handlePressIn = () => {
        timeoutRef.current = setTimeout(() => {
            handleLongPress();
        }, time);

        borderTWidth.value = withTiming('100%', {
            duration: time / 3,
            easing: Easing.linear,
        });

        borderLWidth.value = withDelay(
            time / 3,
            withTiming('100%', {
                duration: time / 3 / 2,
                easing: Easing.linear,
            }),
        );
        borderBWidth.value = withDelay(
            time / 3 + time / 3 / 2,
            withTiming('100%', {
                duration: time / 3,
                easing: Easing.linear,
            }),
        );

        borderRWidth.value = withDelay(
            time / 3 + time / 3 / 2 + time / 3,
            withTiming('100%', {
                duration: time / 3 / 2,
                easing: Easing.linear,
            }),
        );
    };
    const handlePressOut = () => {
        borderTWidth.value = '0%';
        borderLWidth.value = '0%';
        borderBWidth.value = '0%';
        borderRWidth.value = '0%';
        clearTimeout(timeoutRef.current);
    };
    const bRadius = 16;

    const topBorderStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            height: 2,
            width: borderTWidth.value,
            borderRadius: bRadius,
            top: 0,
            left: 0,
            backgroundColor: colors.success,
        };
    });

    const leftBorderStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            height: borderLWidth.value,
            width: 2,
            borderRadius: bRadius,
            top: 0,
            right: 0,
            backgroundColor: colors.success,
        };
    });

    const bottomBorderStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',

            height: 2,
            width: borderBWidth.value,
            borderRadius: bRadius,
            bottom: 0,
            right: 0,
            backgroundColor: colors.success,
        };
    });

    const rightBorderStyle = useAnimatedStyle(() => {
        return {
            position: 'absolute',
            height: borderRWidth.value,
            width: 2,
            borderRadius: bRadius,
            left: 0,
            bottom: 0,
            backgroundColor: colors.success,
        };
    });

    useEffect(() => {
        return () => {
            clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <Container onPressIn={handlePressIn} onPressOut={handlePressOut}>
            <Animated.View style={topBorderStyle} />
            <Animated.View style={leftBorderStyle} />
            <Animated.View style={bottomBorderStyle} />
            <Animated.View style={rightBorderStyle} />
            <TextSemiBold24>{children}</TextSemiBold24>
        </Container>
    );
};
