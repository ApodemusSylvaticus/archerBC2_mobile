import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useCanvasRef, useImage, Image, Group, Rect, SkImage } from '@shopify/react-native-skia';
import { View, PixelRatio, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultModal, DefaultModalProps } from '@/components/modals/DefaultModal';
import { Nullable } from '@/interface/helper';
import { getWindowWidth } from '@/helpers/getWindowParam';

/*
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
*/

interface Rect {
    x: number;
    y: number;
    size: number;
}

// eslint-disable-next-line react/no-unused-prop-types
/* export const PixelEditor: React.FC = img => {
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
    }, []);

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
}; */

const MainContent: React.FC<{ img: SkImage }> = ({ img }) => {
    const ref = useCanvasRef();
    const [newPixels, setPixels] = useState<Rect[]>([]);

    const [realImg, setRealImg] = useState<SkImage>(img);

    // shared
    /*    const sharedHelper = useSharedValue({
        scale: 1,
        actualPosition: { x: 0, y: 0 },
        actualScale: 1,
    });
    const start = useSharedValue({ x: 0, y: 0 }); */
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(1);
    //------------------

    // const
    const { width, height } = useMemo(() => {
        const widthA = getWindowWidth();
        const heightA = (widthA * 3) / 4;
        return { width: widthA, height: heightA };
    }, []);
    const { realImgWidth, realImgHeight } = useMemo(() => {
        const pixelRatio = PixelRatio.get();

        return { realImgWidth: img.width() / pixelRatio, realImgHeight: img.height() / pixelRatio };
    }, [img]);

    //-----------------------

    const createSnapshot = () => {
        if (!ref.current) {
            return;
        }
        const imageSnapshot = ref.current.makeImageSnapshot();
        setRealImg(imageSnapshot);
        setPixels([]);
    };

    const onButtonPress = () => {
        createSnapshot();

        fetch(`http://192.168.1.128:8080/uploadReticleImages?folderName=test`, {
            method: 'POST',
            body: JSON.stringify([
                {
                    fileName: '3',
                    base64Str: realImg.encodeToBase64(),
                },
            ]),
        });
    };

    const tap = Gesture.LongPress()
        .runOnJS(true)
        .onEnd(e => {
            const pixelRatio = PixelRatio.get();

            const x = Math.ceil(e.x / viewScale.value + (translateX.value * -1) / viewScale.value);
            const y = Math.ceil(e.y / viewScale.value + (translateY.value * -1) / viewScale.value);
            const size = 3 / pixelRatio;

            setPixels(prev => [...prev, { x, y, size }]);
            setTimeout(() => {
                createSnapshot();
            }, 0);
        });
    const gesture = Gesture.Race(/* pinchGestureEvent, panG, */ tap);
    return (
        <View>
            <View
                style={{
                    width: realImgWidth,
                    height: realImgHeight,
                    backgroundColor: 'white',
                }}>
                <Canvas
                    ref={ref}
                    style={{
                        width: realImgWidth,
                        height: realImgHeight,
                        backgroundColor: 'white',
                    }}>
                    <Image image={realImg} x={0} y={0} width={realImgWidth} height={realImgHeight} />

                    {newPixels.map(el => (
                        <Rect x={el.x} y={el.y} height={el.size} width={el.size} color="black" strokeWidth={0} />
                    ))}
                </Canvas>
            </View>
            <View style={{ height: 20, width: '100%' }} />

            <GestureHandlerRootView>
                <GestureDetector gesture={gesture}>
                    <Animated.View
                        style={{
                            width,
                            height,
                            backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }}>
                        <Canvas
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
                                <Image image={realImg} x={0} y={0} width={width} height={height} />
                            </Group>
                        </Canvas>
                    </Animated.View>
                </GestureDetector>
            </GestureHandlerRootView>

            <View style={{ height: 20, width: '100%' }} />

            <Button title="test" onPress={onButtonPress} />
        </View>
    );
};

export const PixelEditorModal: React.FC<DefaultModalProps> = ({ isVisible }) => {
    const [image, setImage] = useState<Nullable<string>>(null);
    const img = useImage(image);

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

            setImage(result.assets[0].uri);
        }
        getImg();
    }, []);

    return <DefaultModal isVisible={isVisible}>{img && <MainContent img={img} />}</DefaultModal>;
};
