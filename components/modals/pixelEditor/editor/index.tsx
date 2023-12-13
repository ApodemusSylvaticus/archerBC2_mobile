import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Canvas,
    DiffRect,
    Group,
    Image,
    ImageFormat,
    Rect,
    SkImage,
    SkRRect,
    useCanvasRef,
} from '@shopify/react-native-skia';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    GestureStateChangeEvent,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { throttle } from 'lodash';
import { useTheme } from 'styled-components/native';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Nullable } from '@/interface/helper';
import { MemoGridLayout } from '@/components/modals/pixelEditor/gridLayout';
import { PixelEditorCore } from '@/components/modals/pixelEditor/core';
import { CircleSvg } from '@/components/svg/pixelEditor/circle';
import { PenSvg } from '@/components/svg/pixelEditor/pen';
import { RubberSvg } from '@/components/svg/pixelEditor/rubber';
import { RectangleSvg } from '@/components/svg/pixelEditor/rectangle';
import { HistoryContainer, PressableTool, ToolsContainer } from '@/components/modals/pixelEditor/style';
import { AlertModalContainer } from '@/components/modals/specificModal/alertModal';
import { NumericInput } from '@/components/Inputs/numericInput';
import { DefaultRow } from '@/components/container/defaultBox';
import { GoBackSvg, GoForwardSvg } from '@/components/svg/pixelEditor/historyManipulations';
import { LongPressButton } from '@/components/button/longPressButton';
import { ANIMATION_TIMEOUT, FUNC_TIME_DELAY, ICON_SIZE } from '@/constant/pixelEditor';
import { EditorProps, IRect, TOOLS } from '@/interface/components/pixelEditor';
import {
    Container,
    RealImgContainer,
    SaveButtonContainer,
    SetRadiusContainer,
    VisibleContentContainer,
} from '@/components/modals/pixelEditor/editor/style';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';

function useRerenderEvery50ms() {
    const [rerenderCount, setRerenderCount] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRerenderCount(prevCount => prevCount + 1);
        }, ANIMATION_TIMEOUT);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return rerenderCount;
}

export const Editor: React.FC<EditorProps> = ({ img, setNewImg }) => {
    const { t } = useTranslation();
    const core = useMemo(() => new PixelEditorCore(img), [img]);

    useEffect(() => {
        core.setImgToHistory(img);
    }, []);

    const ref = useCanvasRef();
    const { colors, rem } = useTheme();
    useRerenderEvery50ms();
    const [newPixels, setPixels] = useState<IRect[]>([]);
    const [isHistoryAvailable, setIsHistoryAvailable] = useState({ back: false, forward: false });

    const [radius, setRadius] = useState(1);
    const [penCircleEventValue, setPenCircleEventValue] =
        useState<Nullable<GestureStateChangeEvent<TapGestureHandlerEventPayload>>>(null);

    const [realImg, setRealImg] = useState<SkImage>(img);

    const [activeTool, setActiveTool] = useState<TOOLS>(TOOLS.PEN);

    const [temporaryRectangle, setTemporaryRectangle] = useState<Nullable<{ outer: SkRRect; inner: SkRRect }>>(null);
    const [realRectanle, setRealRectangle] = useState<Nullable<{ outer: SkRRect; inner: SkRRect }>>(null);

    const pressTool = useCallback((data: TOOLS) => setActiveTool(data), []);
    // shared

    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(1);

    //------------------

    // const
    const { width, height } = useMemo(() => core.getContentContainer, []);

    const { width: realImgWidth, height: realImgHeight } = useMemo(() => core.getRealImgParam, []);
    const { gridWidth, gridHeight } = useMemo(() => core.getGridParam, []);

    const [gridParam, setGridParam] = useState({ isVisible: false, gridWidth, gridHeight });

    useEffect(() => {
        core.setActiveTool = activeTool;
    }, [activeTool]);

    const createSnapshot = () => {
        if (!ref.current) {
            return;
        }

        const imageSnapshot = ref.current.makeImageSnapshot();
        setRealImg(imageSnapshot);
        core.setImgToHistory(imageSnapshot);
        setIsHistoryAvailable({ back: true, forward: false });
        setPixels([]);
        setRealRectangle(null);
    };

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onEnd(e => {
            if (activeTool === TOOLS.CIRCLE) {
                setPenCircleEventValue(e);
                return;
            }
            const value = core.tapAction(e);
            setPixels(prev => [...prev, ...value]);
            setTimeout(() => {
                createSnapshot();
            }, ANIMATION_TIMEOUT);
        });

    const handlePan = useCallback(event => {
        const val = core.visualizationDrawingRectangle(event);

        if (val === null) {
            return;
        }

        setTemporaryRectangle(val);
    }, []);

    const throttledPanHandler = useCallback(throttle(handlePan, (ANIMATION_TIMEOUT / 3) * 2), [handlePan]);

    const pinchGestureEvent = Gesture.Pinch()
        .runOnJS(true)
        .onStart(() => {
            core.pinchStart();
        })
        .onChange(event => {
            const value = core.pinchAction(event);
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

    const circleTap = useCallback(() => {
        if (penCircleEventValue) {
            const value = core.circleTapAction(penCircleEventValue, Math.floor(radius));
            setPixels(prev => [...prev, ...value]);
            setTimeout(() => {
                createSnapshot();
                setPenCircleEventValue(null);
            }, ANIMATION_TIMEOUT);
        }
    }, [radius, core, createSnapshot, penCircleEventValue]);

    const panOneG = Gesture.Pan()
        .maxPointers(1)
        .runOnJS(true)
        .onStart(e => {
            if (activeTool === TOOLS.RECTANGLE) {
                core.startDrawRectangle(e);
                return;
            }
            core.panGStart();
        })
        .onChange(event => {
            if (activeTool === TOOLS.RECTANGLE) {
                throttledPanHandler(event);
                return;
            }

            const value = core.panAction(event);
            if (value === null) {
                return;
            }

            translateX.value = value.translateX;
            translateY.value = value.translateY;
        })
        .onEnd(e => {
            if (activeTool === TOOLS.RECTANGLE) {
                const val = core.endDrawingRectangle(e);
                setRealRectangle(val);
                setTemporaryRectangle(null);
                setTimeout(() => {
                    createSnapshot();
                }, ANIMATION_TIMEOUT);

                setTimeout(
                    () => {
                        setTemporaryRectangle(null);
                    },
                    (ANIMATION_TIMEOUT * 3) / 2,
                );
            }
        });

    const panG = Gesture.Pan()
        .minPointers(2)
        .averageTouches(true)
        .runOnJS(true)
        .onStart(() => {
            core.panGStart();
        })
        .onChange(event => {
            const value = core.panAction(event);
            if (value === null) {
                return;
            }

            translateX.value = value.translateX;
            translateY.value = value.translateY;
        });

    const gesture = Gesture.Race(pinchGestureEvent, panOneG, panG, tap);

    const goBackHistory = useCallback(() => {
        const value = core.goBackHistory();
        const { goBack, goForward } = core.isHistoryAvailable;
        setIsHistoryAvailable({ back: goBack, forward: goForward });
        setRealImg(value);
    }, []);
    const goForwardHistory = useCallback(() => {
        const value = core.goForwardHistory();
        const { goBack, goForward } = core.isHistoryAvailable;
        setIsHistoryAvailable({ back: goBack, forward: goForward });
        setRealImg(value);
    }, []);

    const handleFinish = useCallback(() => {
        setNewImg(realImg.encodeToBase64(ImageFormat.PNG, 1));
    }, [realImg, setNewImg]);

    const handleCloseRadiusModal = useCallback(() => {
        setRadius(1);
        setPenCircleEventValue(null);
    }, []);

    return (
        <Container>
            <VisibleContentContainer>
                {/* Content */}
                <GestureHandlerRootView>
                    <GestureDetector gesture={gesture}>
                        <Animated.View
                            style={{
                                width,
                                height,
                            }}>
                            <Canvas
                                style={{
                                    width,
                                    height,
                                }}>
                                <Group
                                    transform={[
                                        { translateY: translateY.value },
                                        { translateX: translateX.value },
                                        { scale: viewScale.value },
                                    ]}>
                                    <Image image={realImg} x={0} y={0} width={width} height={height} />
                                </Group>

                                {temporaryRectangle && (
                                    <DiffRect
                                        inner={temporaryRectangle.inner}
                                        outer={temporaryRectangle.outer}
                                        color={colors.success}
                                    />
                                )}
                            </Canvas>
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
                {/* TODO Array length error */}
                {gridParam.isVisible && (
                    <MemoGridLayout width={gridParam.gridWidth} height={gridParam.gridHeight} totalWidth={width} />
                )}

                <ToolsContainer>
                    <PressableTool onPress={() => pressTool(TOOLS.PEN)}>
                        <PenSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.PEN ? colors.success : colors.l1ActiveEl}
                        />
                    </PressableTool>
                    <PressableTool onPress={() => pressTool(TOOLS.RUBBER)}>
                        <RubberSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.RUBBER ? colors.success : colors.l1ActiveEl}
                        />
                    </PressableTool>
                    <PressableTool onPress={() => pressTool(TOOLS.CIRCLE)}>
                        <CircleSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.CIRCLE ? colors.success : colors.l1ActiveEl}
                        />
                    </PressableTool>
                    <PressableTool onPress={() => pressTool(TOOLS.RECTANGLE)}>
                        <RectangleSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.RECTANGLE ? colors.success : colors.l1ActiveEl}
                        />
                    </PressableTool>
                </ToolsContainer>

                <HistoryContainer>
                    <PressableTool disabled={!isHistoryAvailable.back} onPress={goBackHistory}>
                        <GoBackSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={isHistoryAvailable.back ? colors.l1ActiveEl : colors.cardBg}
                        />
                    </PressableTool>
                    <PressableTool disabled={!isHistoryAvailable.forward} onPress={goForwardHistory}>
                        <GoForwardSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={isHistoryAvailable.forward ? colors.l1ActiveEl : colors.cardBg}
                        />
                    </PressableTool>
                </HistoryContainer>

                <SaveButtonContainer>
                    <LongPressButton time={FUNC_TIME_DELAY} handleLongPress={handleFinish}>
                        {t('default_save')}
                    </LongPressButton>
                </SaveButtonContainer>
            </VisibleContentContainer>

            <AlertModalContainer isOpen={!!penCircleEventValue} closeHandler={handleCloseRadiusModal}>
                <SetRadiusContainer>
                    <DefaultRow>
                        <NumericInput
                            value={radius.toString()}
                            onChangeText={val => setRadius(val)}
                            label="Set radius"
                            onBlur={() => undefined}
                            background={colors.cardBg}
                        />
                    </DefaultRow>
                    <DefaultButton onPress={circleTap}>
                        <TextSemiBold20>{t('default_add')}</TextSemiBold20>
                    </DefaultButton>
                </SetRadiusContainer>
            </AlertModalContainer>

            <RealImgContainer width={realImgWidth} height={realImgHeight}>
                <Canvas
                    ref={ref}
                    style={{
                        width: realImgWidth,
                        height: realImgHeight,
                    }}>
                    <Image image={realImg} x={0} y={0} width={realImgWidth} height={realImgHeight} />
                    {newPixels.map(el => (
                        <Rect x={el.x} y={el.y} height={el.size} width={el.size} color={el.color} strokeWidth={0} />
                    ))}

                    {realRectanle && <DiffRect inner={realRectanle.inner} outer={realRectanle.outer} color="black" />}
                </Canvas>
            </RealImgContainer>
        </Container>
    );
};
