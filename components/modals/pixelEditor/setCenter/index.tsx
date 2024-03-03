import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Canvas, Image, Group, SkImage, Paint, ColorMatrix, OpacityMatrix } from '@shopify/react-native-skia';
import Animated, { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ButtonsContainer, Container } from '@/components/modals/pixelEditor/setCenter/style';
import { MemoGridLayout } from '@/components/modals/pixelEditor/gridLayout';
import { DefaultModal, DefaultModalWithBackBtnProps, ModalHeader } from '@/components/modals/DefaultModal';
import { GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { PixelEditorCore } from '@/core/pixelEditor';
import { TextSemiBold20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';

interface ISetCenterModal extends DefaultModalWithBackBtnProps {
    img: SkImage;
    acceptAction: (skImg: SkImage) => void;
}

export const SetCenterModal: React.FC<ISetCenterModal> = React.memo(
    ({ img, isVisible, backButtonHandler, acceptAction }) => {
        const [core, setCore] = useState<PixelEditorCore>(new PixelEditorCore(img));
        const [tempImg, setTempImg] = useState<SkImage>(img);
        const [isChanged, setIsChanged] = useState(false);
        const centerImg = useMemo(() => core.centerManager.getTemporaryCenter(), [core]);
        const { width, height } = useMemo(() => core.envSetup.getContentContainer, [core]);

        useEffect(() => {
            if (isVisible) {
                setCore(new PixelEditorCore(img));
                setTempImg(img);
            }
        }, [isVisible, img]);

        const customBackButtonHandler = useCallback(() => {
            setIsChanged(false);
            backButtonHandler();
        }, [backButtonHandler]);

        const { t } = useTranslation();
        const translateX = useSharedValue(0);
        const translateY = useSharedValue(0);
        const viewScale = useSharedValue(1);

        const { gridWidth, gridHeight } = useMemo(() => core.gridManager.getGridParam, [core]);

        const [gridParam, setGridParam] = useState({ isVisible: false, gridWidth, gridHeight });

        const panOneG = Gesture.Pan()
            .maxPointers(1)
            .runOnJS(true)
            .onStart(() => {
                core.gestureManager.panGStart();
            })
            .onChange(event => {
                const value = core.gestureManager.panAction(event);
                if (value === null) {
                    return;
                }

                translateX.value = value.translateX;
                translateY.value = value.translateY;
            });

        const pinchGestureEvent = Gesture.Pinch()
            .runOnJS(true)
            .onStart(() => {
                core.gestureManager.pinchStart();
            })
            .onChange(event => {
                const value = core.gestureManager.pinchAction(event);
                if (!value) {
                    return;
                }
                translateX.value = withTiming(value.translateX);
                translateY.value = withTiming(value.translateY);

                viewScale.value = withTiming(value.viewScale);
                setGridParam({
                    gridWidth: value.gridParam.width,
                    gridHeight: value.gridParam.height,
                    isVisible: value.gridParam.isVisible,
                });
            });

        const tap = Gesture.Tap()
            .runOnJS(true)
            .onEnd(e => {
                if (isChanged === false) {
                    const value = core.centerManager.setCenter(e);
                    core.gestureManager.resetAllValue();
                    const zeroGridParam = core.gridManager.getGridLineParam[0];
                    setGridParam({
                        gridWidth: zeroGridParam.width,
                        gridHeight: zeroGridParam.height,
                        isVisible: zeroGridParam.isVisible,
                    });
                    setTempImg(value);
                    setIsChanged(true);

                    translateX.value = withTiming(0);
                    translateY.value = withTiming(0);
                    viewScale.value = withTiming(1);
                }
            });
        const gesture = Gesture.Race(Gesture.Simultaneous(pinchGestureEvent, panOneG), tap);

        const transformParams = useDerivedValue(
            () => [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: viewScale.value }],
            [viewScale, translateY, translateX],
        );

        return (
            <DefaultModal isVisible={isVisible}>
                <ModalHeader>
                    <GoBackButton onPress={customBackButtonHandler}>
                        <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                    </GoBackButton>
                </ModalHeader>

                <Container>
                    <TextSemiBold24>Set center</TextSemiBold24>
                    <GestureHandlerRootView>
                        <GestureDetector gesture={gesture}>
                            <Animated.View
                                style={{
                                    width,
                                    height,
                                    position: 'relative',
                                }}>
                                <Canvas
                                    style={{
                                        width,
                                        height,
                                        flex: 1,
                                    }}>
                                    <Group transform={transformParams}>
                                        <Image image={tempImg} x={0} y={0} width={width} height={height} />
                                    </Group>
                                </Canvas>

                                <View style={{ position: 'absolute', top: 0, left: 0 }} pointerEvents="none">
                                    <Canvas
                                        style={{
                                            width,
                                            height,
                                            flex: 1,
                                        }}>
                                        <Group
                                            transform={transformParams}
                                            layer={
                                                <Paint>
                                                    <ColorMatrix matrix={OpacityMatrix(0.5)} />
                                                </Paint>
                                            }>
                                            <Image image={centerImg} x={0} y={0} width={width} height={height} />
                                        </Group>
                                    </Canvas>
                                </View>
                                {gridParam.isVisible && (
                                    <MemoGridLayout
                                        width={gridParam.gridWidth}
                                        height={gridParam.gridHeight}
                                        totalWidth={width}
                                        totalHeight={height}
                                    />
                                )}
                            </Animated.View>
                        </GestureDetector>
                    </GestureHandlerRootView>

                    {isChanged && (
                        <ButtonsContainer>
                            <DefaultButton
                                style={{ flex: 1 }}
                                onPress={() => {
                                    setIsChanged(false);
                                    setTempImg(img);
                                }}>
                                <TextSemiBold20>Undo</TextSemiBold20>
                            </DefaultButton>
                            <DefaultButton
                                style={{ flex: 1 }}
                                onPress={() => {
                                    acceptAction(tempImg);
                                }}>
                                <TextSemiBold20>Accept</TextSemiBold20>
                            </DefaultButton>
                        </ButtonsContainer>
                    )}
                </Container>
            </DefaultModal>
        );
    },
);
