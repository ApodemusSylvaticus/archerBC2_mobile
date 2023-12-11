import React, { useCallback, useMemo, useState } from 'react';
import { SkImage, useCanvasRef, Canvas, Image, Rect } from '@shopify/react-native-skia';
import Animated, { useSharedValue } from 'react-native-reanimated';
import { PixelRatio, ScrollView } from 'react-native';
import { useTheme } from 'styled-components/native';
import { Nullable } from '@/interface/helper';
import { LongPressButton } from '@/components/button/longPressButton';
import {
    Container,
    ControlPadContainer,
    CrossContainer,
    HorizontalLine,
    VerticalLine,
} from '@/components/modals/pixelEditor/setCenter/style';
import { PureArrow } from '@/components/svg/pureArrow';
import { SeparateRow } from '@/components/container/defaultBox';
import { ANIMATION_TIMEOUT, FUNC_TIME_DELAY, ICON_SIZE, NUMBER_OF_CENTER_CELL } from '@/constant/pixelEditor';

function findClosestWidth(inputNumber: number): number {
    let result = inputNumber;
    const pixelRatio = PixelRatio.get();

    while (result % pixelRatio !== 0 || (result * 3) % 4 !== 0) {
        result += 1;
    }

    return result;
}
export const SetCenterComponent: React.FC<{ img: SkImage; centerSelectedAction: (img: SkImage) => void }> = ({
    img,
    centerSelectedAction,
}) => {
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const ref = useCanvasRef();
    const [secondImg, setSecondImg] = useState<Nullable<SkImage>>(null);
    const pixelRatio = useMemo(() => PixelRatio.get(), []);
    const { rem } = useTheme();

    const { containerWidth, imgWidth, containerHeight, imgHeight } = useMemo(() => {
        const rImgWidth = img.width();

        const rImgHeight = img.height();

        const findedWidth = findClosestWidth(rImgWidth);

        return {
            containerWidth: findedWidth / pixelRatio,
            containerHeight: ((findedWidth / pixelRatio) * 3) / 4,
            imgWidth: rImgWidth / pixelRatio,
            imgHeight: rImgHeight / pixelRatio,
        };
    }, [img]);

    const setSecondImgHandler = useCallback(() => {
        if (ref.current) {
            setTimeout(() => {
                const a = ref.current!.makeImageSnapshot({
                    width: 21,
                    height: 21,
                    x: (containerWidth * pixelRatio) / 2 - 10,
                    y: (containerHeight * pixelRatio) / 2 - 10,
                });

                setSecondImg(a);
            }, ANIMATION_TIMEOUT);
        }
    }, [ref.current, containerWidth, containerHeight]);

    const handleFinish = useCallback(() => {
        if (ref.current) {
            const imageSnapshot = ref.current.makeImageSnapshot();
            centerSelectedAction(imageSnapshot);
        }
    }, []);
    const moveHorizontally = (dx: number) => {
        translateX.value += dx;
        setSecondImgHandler();
    };

    const moveVertically = (dy: number) => {
        translateY.value += dy;
        setSecondImgHandler();
    };

    return (
        <ScrollView>
            <Container>
                <Animated.View
                    style={{
                        width: containerWidth,
                        height: containerHeight,
                        position: 'relative',
                    }}>
                    <Canvas
                        onLayout={() => setSecondImgHandler()}
                        ref={ref}
                        style={{
                            width: containerWidth,
                            height: containerHeight,
                            flex: 1,
                        }}>
                        <Rect width={containerWidth} height={containerHeight} x={0} y={0} color="white" />
                        <Image image={img} x={translateX} y={translateY} width={imgWidth} height={imgHeight} />
                    </Canvas>

                    <CrossContainer>
                        <VerticalLine
                            containerHeight={containerHeight}
                            containerWidth={containerWidth}
                            pixelRatio={pixelRatio}
                        />
                        <HorizontalLine
                            containerHeight={containerHeight}
                            containerWidth={containerWidth}
                            pixelRatio={pixelRatio}
                        />
                    </CrossContainer>
                </Animated.View>

                {secondImg !== null && (
                    <>
                        <Animated.View
                            style={{
                                width: containerWidth,
                                height: containerWidth,
                            }}>
                            <Canvas
                                style={{
                                    width: containerWidth,
                                    height: containerWidth,
                                    flex: 1,
                                }}>
                                <Image image={secondImg} x={0} y={0} width={containerWidth} height={containerWidth} />
                                <Rect
                                    width={containerWidth / NUMBER_OF_CENTER_CELL}
                                    height={containerWidth}
                                    x={(containerWidth / NUMBER_OF_CENTER_CELL) * 10}
                                    y={0}
                                    color="rgba(120, 159, 255, 0.3)"
                                />
                                <Rect
                                    width={containerWidth}
                                    height={containerWidth / NUMBER_OF_CENTER_CELL}
                                    x={0}
                                    y={(containerWidth / NUMBER_OF_CENTER_CELL) * 10}
                                    color="rgba(120, 159, 255, 0.3)"
                                />
                            </Canvas>
                        </Animated.View>

                        <ControlPadContainer>
                            <PureArrow
                                width={ICON_SIZE * rem}
                                height={ICON_SIZE * rem}
                                fillColor="red"
                                orientation="top"
                                onPress={() => moveVertically(-1 / pixelRatio)}
                            />
                            <SeparateRow>
                                <PureArrow
                                    width={ICON_SIZE * rem}
                                    height={ICON_SIZE * rem}
                                    fillColor="red"
                                    orientation="left"
                                    onPress={() => moveHorizontally(-1 / pixelRatio)}
                                />
                                <PureArrow
                                    width={ICON_SIZE * rem}
                                    height={ICON_SIZE * rem}
                                    fillColor="red"
                                    orientation="right"
                                    onPress={() => moveHorizontally(1 / pixelRatio)}
                                />
                            </SeparateRow>
                            <PureArrow
                                width={ICON_SIZE * rem}
                                height={ICON_SIZE * rem}
                                fillColor="red"
                                orientation="bottom"
                                onPress={() => moveVertically(1 / pixelRatio)}
                            />
                        </ControlPadContainer>

                        <LongPressButton time={FUNC_TIME_DELAY} handleLongPress={handleFinish}>
                            Next stage
                        </LongPressButton>
                    </>
                )}
            </Container>
        </ScrollView>
    );
};
