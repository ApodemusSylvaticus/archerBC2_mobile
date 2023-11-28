import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, useCanvasRef, useImage, Image, Group, Rect, SkImage } from '@shopify/react-native-skia';
import { View, PixelRatio, Button } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { DefaultModal, DefaultModalProps } from '@/components/modals/DefaultModal';
import { Nullable } from '@/interface/helper';
import { getWindowWidth } from '@/helpers/getWindowParam';
import { MemoGridLayout } from '@/components/modals/pixelEditor/gridLayout';

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

interface Rect {
    x: number;
    y: number;
    size: number;
}

const closestLeftThird = (value: number): number => {
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;

    const pixelRatio = PixelRatio.get();

    for (let i = pixelRatio - 1; i > 0; i -= 1) {
        if (decimalPart > i / pixelRatio) {
            return integerPart + i / pixelRatio;
        }
    }

    return integerPart;
};

// нужно переписать что бы всегда было 16 на 12
// это вроде как возможно
function findClosestDivisor(width: number): number {
    const preference = [16, 12, 20];
    let actualPref = 20;
    for (let i = 0; i < preference.length - 1; i += 1) {
        if (width % preference[i] === 0) {
            actualPref = preference[i];
            break;
        }
    }

    return width / actualPref;
}

const MainContent: React.FC<{ img: SkImage }> = ({ img }) => {
    const ref = useCanvasRef();
    useRerenderEvery50ms();
    const [newPixels, setPixels] = useState<Rect[]>([]);

    const [realImg, setRealImg] = useState<SkImage>(img);

    // shared
    const sharedHelper = useSharedValue({
        scale: 1,
        actualPosition: { x: 0, y: 0 },
        actualScale: 2.5,
    });
    const start = useSharedValue({ x: 0, y: 0 });
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(2.5);
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

    const { gridWidth, gridHeight } = useMemo(() => {
        const closestDivisor = findClosestDivisor(img.width());
        return { gridWidth: img.width() / closestDivisor, gridHeight: img.height() / closestDivisor };
    }, [img]);

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
                    fileName: '4',
                    base64Str: realImg.encodeToBase64(),
                },
            ]),
        });
    };

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onEnd(e => {
            const pixelRatio = PixelRatio.get();
            console.log({
                scale: viewScale.value,
                translateX: translateX.value,
                translateY: translateY.value,
                width,
                height,
                gridWidth,
                gridHeight,
                realImgWidth,
                realImgHeight,
                pixelRatio: PixelRatio.get(),
                imgW: img.width(),
                imgH: img.height(),
            });

            const xPos = (e.x + translateX.value * -1) / viewScale.value;
            const yPos = (e.y + translateY.value * -1) / viewScale.value;

            const x = closestLeftThird((xPos * realImgWidth) / width);
            const y = closestLeftThird((yPos * realImgHeight) / height);

            const size = 1 / pixelRatio;

            setPixels(prev => [...prev, { x, y, size }]);
            setTimeout(() => {
                createSnapshot();
            }, 25);
        });

    const panG = Gesture.Pan()
        .runOnJS(true)
        .onStart(() => {
            start.value = { x: sharedHelper.value.actualPosition.x, y: sharedHelper.value.actualPosition.y };
        })

        .onChange(event => {
            console.log({ width, height, gridWidth, gridHeight });
            if (sharedHelper.value.actualScale === 1) {
                return;
            }

            if (sharedHelper.value.actualScale >= 20) {
                const xT = start.value.x + event.translationX;
                const yT = start.value.y + event.translationY;
                const remainderxT = xT % 22.5; // 22.5 => width / cell size;
                const remainderyT = yT % 22.5;

                const closestxT = remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + 22.5;
                const closestyT = remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + 22.5;
                sharedHelper.value.actualPosition.x = closestxT >= 0 ? 0 : closestxT;
                sharedHelper.value.actualPosition.y = closestyT >= 0 ? 0 : closestyT;

                translateX.value = closestxT >= 0 ? 0 : closestxT;
                translateY.value = closestyT >= 0 ? 0 : closestyT;
                return;
            }

            const xT = start.value.x + event.translationX;
            const yT = closestLeftThird(start.value.y + event.translationY);
            sharedHelper.value.actualPosition.x = xT >= 0 ? 0 : xT;
            sharedHelper.value.actualPosition.y = yT >= 0 ? 0 : yT;

            translateX.value = xT >= 0 ? 0 : xT;
            translateY.value = yT >= 0 ? 0 : yT;
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
                        x: closestLeftThird(sharedHelper.value.actualPosition.x * 2 - event.focalX),
                        y: closestLeftThird(sharedHelper.value.actualPosition.y * 2 - event.focalY),
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
                        x: closestLeftThird(sharedHelper.value.actualPosition.x / 2),
                        y: closestLeftThird(sharedHelper.value.actualPosition.y / 2),
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
                    x: closestLeftThird(sharedHelper.value.actualPosition.x / 2),
                    y: closestLeftThird(sharedHelper.value.actualPosition.y / 2),
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
                    x: closestLeftThird(sharedHelper.value.actualPosition.x * 2 - event.focalX),
                    y: closestLeftThird(sharedHelper.value.actualPosition.y * 2 - event.focalY),
                };
                translateX.value = withTiming(sharedHelper.value.actualPosition.x);
                translateY.value = withTiming(sharedHelper.value.actualPosition.y);

                viewScale.value = withTiming(sharedHelper.value.actualScale);

                sharedHelper.value.scale += 0.25;
            }
        });

    const gesture = Gesture.Race(pinchGestureEvent, panG, tap);

    return (
        <View>
            <View style={{ height: 32, width: '100%' }} />

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

            <View style={{ position: 'relative' }}>
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

                <MemoGridLayout width={gridWidth} height={gridHeight} totalWidth={width} />
            </View>

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
