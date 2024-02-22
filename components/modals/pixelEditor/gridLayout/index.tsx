import React, { useEffect, useMemo } from 'react';
import { Canvas, Line, vec } from '@shopify/react-native-skia';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Container } from '@/components/modals/pixelEditor/gridLayout/style';

interface GridLayoutProps {
    width: number;
    height: number;
    totalWidth: number;
    totalHeight: number;
}

export const GridLayout: React.FC<GridLayoutProps> = ({ height, width, totalWidth, totalHeight }) => {
    const size = totalWidth / width;
    const opacity = useSharedValue(0);

    useEffect(() => {
        opacity.value = 0;
        opacity.value = withTiming(1, { duration: 350 });
    }, [opacity, width]);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            opacity: opacity.value,
        };
    });

    const vertical = useMemo(() => {
        const array = [];
        for (let i = 0; i <= width; i += 1) {
            array.push(
                <Line
                    key={`vertical_${i}`}
                    p1={vec(i * size, 0)}
                    p2={vec(i * size, totalHeight)}
                    color="black"
                    style="stroke"
                    strokeWidth={0.1}
                />,
            );
        }
        return array;
    }, [totalHeight, width, size]);

    const horizontal = useMemo(() => {
        const array = [];
        for (let i = 0; i <= height; i += 1) {
            array.push(
                <Line
                    key={`horizontal_${i}`}
                    p1={vec(0, i * size)}
                    p2={vec(totalWidth, i * size)}
                    color="black"
                    style="stroke"
                    strokeWidth={0.1}
                />,
            );
        }
        return array;
    }, [height, size, totalWidth]);

    return (
        <Container pointerEvents="none">
            <Animated.View style={[{ width: totalWidth, height: totalHeight }, animatedStyle]}>
                <Canvas
                    style={{
                        width: totalWidth,
                        height: totalHeight,
                    }}>
                    {horizontal}
                    {vertical}
                </Canvas>
            </Animated.View>
        </Container>
    );
};

export const MemoGridLayout = React.memo(GridLayout);
