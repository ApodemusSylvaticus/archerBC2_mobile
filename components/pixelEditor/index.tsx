import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useCanvasRef, useImage, Image } from '@shopify/react-native-skia';
import * as ImagePicker from 'expo-image-picker';
import { Button, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { getWindowWidth } from '@/helpers/getWindowParam';
import { Text20 } from '@/components/text/styled';
import { MemoGridLayout } from '@/components/pixelEditor/gridLayout';

function useRerenderEvery50ms() {
    const [rerenderCount, setRerenderCount] = useState(0);
    useEffect(() => {
        const intervalId = setInterval(() => {
            setRerenderCount(prevCount => prevCount + 1);
        }, 10);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return rerenderCount;
}

export const PixelEditor: React.FC = () => {
    const { width, height } = useMemo(() => {
        return {
            width: getWindowWidth(),
            height: (getWindowWidth() * 3) / 4,
        };
    }, []);
    useRerenderEvery50ms();

    const [img, setImg] = useState('');
    const image = useImage(img);

    const ref = useCanvasRef();
    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
        });
        if (result.canceled) {
            return;
        }

        const { uri } = result.assets[0];

        setImg(uri);
    };
    const sharedHelper = useSharedValue({
        scale: 1,
        actualPosition: { x: 0, y: 0 },
        actualScale: 1,
    });

    const start = useSharedValue({ x: 0, y: 0 });
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(1);

    const panG = Gesture.Pan()
        .onStart(() => {
            start.value = { x: sharedHelper.value.actualPosition.x, y: sharedHelper.value.actualPosition.y };
        })

        .onChange(event => {
            if (sharedHelper.value.actualScale === 1) {
                return;
            }
            sharedHelper.value.actualPosition.x = start.value.x + event.translationX;
            sharedHelper.value.actualPosition.y = start.value.y + event.translationY;
            translateX.value = start.value.x + event.translationX;
            translateY.value = start.value.y + event.translationY;
        });

    const pinchGestureEvent = Gesture.Pinch()
        .onStart(() => {
            sharedHelper.value.scale = 1;
        })
        .onChange(event => {
            const prevActualScale = sharedHelper.value.actualScale;
            if (event.scale > 1) {
                if (event.scale >= sharedHelper.value.scale + 0.5 && sharedHelper.value.actualScale !== 128) {
                    sharedHelper.value.actualScale = prevActualScale * 2;
                    sharedHelper.value.actualPosition = {
                        x: sharedHelper.value.actualPosition.x * 2 - event.focalX,
                        y: sharedHelper.value.actualPosition.y * 2 - event.focalY,
                    };
                    translateX.value = withTiming(sharedHelper.value.actualPosition.x);
                    translateY.value = withTiming(sharedHelper.value.actualPosition.y);

                    viewScale.value = withTiming(sharedHelper.value.actualScale);
                    sharedHelper.value.scale += 0.5;
                    return;
                }

                if (event.scale <= sharedHelper.value.scale - 0.5 && sharedHelper.value.actualScale !== 1) {
                    sharedHelper.value.actualScale = prevActualScale / 2;
                    sharedHelper.value.actualPosition = {
                        x: sharedHelper.value.actualPosition.x / 2,
                        y: sharedHelper.value.actualPosition.y / 2,
                    };
                    translateX.value = withTiming(sharedHelper.value.actualPosition.x);
                    translateY.value = withTiming(sharedHelper.value.actualPosition.y);

                    viewScale.value = withTiming(sharedHelper.value.actualScale);
                    sharedHelper.value.scale -= 0.5;
                    return;
                }
                return;
            }

            if (event.scale <= sharedHelper.value.scale - 0.25 && sharedHelper.value.actualScale !== 1) {
                sharedHelper.value.actualScale = prevActualScale / 2;
                sharedHelper.value.actualPosition = {
                    x: sharedHelper.value.actualPosition.x / 2,
                    y: sharedHelper.value.actualPosition.y / 2,
                };
                translateX.value = withTiming(sharedHelper.value.actualPosition.x);
                translateY.value = withTiming(sharedHelper.value.actualPosition.y);
                viewScale.value = withTiming(sharedHelper.value.actualScale);
                sharedHelper.value.scale -= 0.25;
                return;
            }

            if (event.scale > sharedHelper.value.scale + 0.25 && sharedHelper.value.actualScale !== 128) {
                sharedHelper.value.actualScale = prevActualScale * 2;
                sharedHelper.value.actualPosition = {
                    x: sharedHelper.value.actualPosition.x * 2 - event.focalX,
                    y: sharedHelper.value.actualPosition.y * 2 - event.focalY,
                };
                translateX.value = withTiming(sharedHelper.value.actualPosition.x);
                translateY.value = withTiming(sharedHelper.value.actualPosition.y);

                viewScale.value = withTiming(sharedHelper.value.actualScale);

                sharedHelper.value.scale += 0.25;
            }
        });

    const tap = Gesture.Tap();

    const gesture = Gesture.Race(pinchGestureEvent, panG, tap);
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Button title="Set img" onPress={chooseImage} />
            <Text20>{viewScale.value}</Text20>
            <View style={{ position: 'relative' }}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={{ width, height, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                        <Canvas ref={ref} style={{ width, height, backgroundColor: 'white' }}>
                            <Image
                                transform={[
                                    { translateY: translateY.value },
                                    { translateX: translateX.value },
                                    { scale: viewScale.value },
                                ]}
                                image={image}
                                fit="contain"
                                x={0}
                                y={0}
                                width={width}
                                height={height}
                            />
                        </Canvas>
                    </Animated.View>
                </GestureDetector>

                <MemoGridLayout width={20} height={15} />
            </View>
        </GestureHandlerRootView>
    );
};
