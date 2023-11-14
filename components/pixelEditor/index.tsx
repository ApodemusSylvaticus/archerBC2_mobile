import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useCanvasRef, useImage, Image, Group, Rect, SkImage } from '@shopify/react-native-skia';
import * as ImagePicker from 'expo-image-picker';
import { Button, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getWindowWidth } from '@/helpers/getWindowParam';
import { Text20 } from '@/components/text/styled';
import { MemoGridLayout } from '@/components/pixelEditor/gridLayout';

function closestMultipleOf18(number: number) {
    return Math.floor(number / 18) * 18;
}
function useRerenderEvery50ms() {
    const [rerenderCount, setRerenderCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRerenderCount(prevCount => prevCount + 1);
        }, 25);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return rerenderCount;
}

// eslint-disable-next-line react/no-unused-prop-types
export const PixelEditor: React.FC<{ width: number; height: number; uri: string }> = img => {
    useRerenderEvery50ms();
    const ref = useCanvasRef();

    const [q, setQ] = useState<SkImage>();

    const { top, bottom } = useSafeAreaInsets();

    // eslint-disable-next-line react/destructuring-assignment
    const image = useImage(img.uri);

    const { height, width } = useMemo(() => {
        const notRoundedHeight = getWindowWidth() - top - bottom - 16;
        const notRoundedWidth = (notRoundedHeight * 4) / 3;
        console.log({ height: Math.floor(notRoundedHeight), width: Math.floor(notRoundedWidth) });
        return { height: notRoundedHeight, width: notRoundedWidth };
    }, [top, bottom]);

    const sharedHelper = useSharedValue({
        scale: 1,
        actualPosition: { x: 0, y: 0 },
        actualScale: 1,
    });

    const start = useSharedValue({ x: 0, y: 0 });
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(1);
    const [rec, setRec] = useState({ size: 0, x: 0, y: 0 });

    const testFunc = () => {
        const imageSnapshot = ref.current?.makeImageSnapshot();
        console.log(imageSnapshot?.width());
        console.log(imageSnapshot?.height());

        setQ(imageSnapshot);
        sharedHelper.value.actualScale = 9.5703125;
        viewScale.value = 9.5703125;
    };

    const panG = Gesture.Pan()
        .runOnJS(true)
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
        .runOnJS(true)
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

    const tap = Gesture.LongPress()
        .runOnJS(true)
        .onEnd(e => {
            const x = e.x / viewScale.value + (translateX.value * -1) / viewScale.value;
            const y = e.y / viewScale.value + (translateY.value * -1) / viewScale.value;
            const size = 18 / viewScale.value;

            setRec({ x: closestMultipleOf18(x), y: closestMultipleOf18(y), size });

            translateX.value = 0;
            translateY.value = 0;
            viewScale.value = 1;
            setTimeout(() => {
                const newImg = ref.current?.makeImageSnapshot();

                if (newImg) {
                    setQ(newImg);
                    console.log('newImg', { width: newImg.width(), height: newImg.height() });

                    const s = newImg.encodeToBase64();

                    fetch(`http://192.168.1.128:8080/uploadReticleImages?folderName=test`, {
                        method: 'POST',
                        body: JSON.stringify([
                            {
                                fileName: '1',
                                base64Str: s,
                            },
                        ]),
                    })
                        .then(console.log)
                        .catch(console.log);

                    translateX.value = sharedHelper.value.actualPosition.x;
                    translateY.value = sharedHelper.value.actualPosition.y;
                    viewScale.value = sharedHelper.value.actualScale;
                    setRec({ x: 0, y: 0, size: 0 });
                }
            }, 50);
        });

    const gesture = Gesture.Race(pinchGestureEvent, panG, tap);
    return (
        <GestureHandlerRootView style={{ flex: 1, backgroundColor: 'black', display: 'flex', flexDirection: 'row' }}>
            <View style={{ position: 'relative', width }}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={{ width, height, backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                        <Canvas
                            ref={ref}
                            style={{
                                width,
                                height,
                                backgroundColor: 'white',
                                flex: 1,
                            }}>
                            <Group
                                transform={[
                                    { translateY: translateY.value },
                                    { translateX: translateX.value },
                                    { scale: viewScale.value },
                                ]}>
                                <Image image={q || image} fit="contain" x={0} y={0} width={width} height={height} />
                            </Group>
                            <Rect
                                x={rec.x}
                                y={rec.y}
                                height={rec.size}
                                width={rec.size}
                                color="black"
                                strokeWidth={0}
                            />
                        </Canvas>
                    </Animated.View>
                </GestureDetector>

                <MemoGridLayout width={16} height={12} totalWidth={width} />
            </View>
            <View style={{ padding: 16 }}>
                <Text20>{viewScale.value}</Text20>
                <Text20>width: {width}</Text20>
                <Text20>height: {height}</Text20>
                <Button title="testButton" onPress={testFunc} />
            </View>
        </GestureHandlerRootView>
    );
};

export const PreloadPixelEditor = () => {
    const [img, setImg] = useState({ width: 0, height: 0, uri: '' });

    useEffect(() => {
        async function getImg() {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,

                allowsEditing: true,

                quality: 1,
                aspect: [4, 3],
            });
            if (result.canceled) {
                return;
            }

            const { uri, width, height } = result.assets[0];
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

            setImg({ uri, width, height });
        }

        getImg();
    });

    if (img.uri === '') {
        return;
    }

    // eslint-disable-next-line consistent-return
    return <PixelEditor {...img} />;
};
