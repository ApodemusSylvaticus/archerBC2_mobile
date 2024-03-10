import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    Canvas,
    ColorMatrix,
    DiffRect,
    Group,
    Image,
    ImageFormat,
    Line,
    OpacityMatrix,
    Paint,
    SkImage,
    SkRRect,
    vec,
} from '@shopify/react-native-skia';
import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    GestureStateChangeEvent,
    GestureUpdateEvent,
    PanGestureChangeEventPayload,
    PanGestureHandlerEventPayload,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { throttle } from 'lodash';
import { useTheme } from 'styled-components/native';
import Animated, { useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { Nullable } from '@/interface/helper';
import { MemoGridLayout } from '@/components/modals/pixelEditor/gridLayout';
import { CircleSvg } from '@/components/svg/pixelEditor/circle';
import { PenSvg } from '@/components/svg/pixelEditor/pen';
import { RectangleSvg } from '@/components/svg/pixelEditor/rectangle';
import {
    CenterControllerButton,
    CenterControllerContainer,
    HistoryContainer,
    PressableTool,
    ToolsContainer,
} from '@/components/modals/pixelEditor/style';
import { AlertModalContainer } from '@/components/modals/specificModal/alertModal';
import { NumericInput } from '@/components/Inputs/numericInput';
import { DefaultRow } from '@/components/container/defaultBox';
import { GoBackSvg, GoForwardSvg } from '@/components/svg/pixelEditor/historyManipulations';
import { LongPressButton } from '@/components/button/longPressButton';
import { ANIMATION_TIMEOUT_THROTTLE, FUNC_TIME_DELAY, ICON_SIZE } from '@/constant/pixelEditor';
import { EditorProps, TOOLS } from '@/interface/components/pixelEditor';
import {
    CenterImgContainer,
    Container,
    SaveButtonContainer,
    SetRadiusContainer,
    VisibleContentContainer,
} from '@/components/modals/pixelEditor/editor/style';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { LineSvg } from '@/components/svg/pixelEditor/line';
import { PixelEditorCore } from '@/core/pixelEditor';
import { SetCenterModal } from '@/components/modals/pixelEditor/setCenter';

export const Editor: React.FC<EditorProps> = ({ img, setNewImg }) => {
    const { t } = useTranslation();
    const core = useMemo(() => new PixelEditorCore(img), [img]);

    const [isCenterShown, setIsCenterShown] = useState(true);

    const toggleIsCenterShown = useCallback(() => setIsCenterShown(prev => !prev), []);

    const centerImg = useMemo(() => core.centerManager.getTemporaryCenter(), []);

    const { colors, rem } = useTheme();
    const [isChangeCenterOpen, setIsChangeCenterOpen] = useState(false);
    const toggleIsChangeCenterOpen = useCallback(() => setIsChangeCenterOpen(prev => !prev), []);

    const [isHistoryAvailable, setIsHistoryAvailable] = useState({ back: false, forward: false });
    const [radius, setRadius] = useState(1);
    const [penCircleEventValue, setPenCircleEventValue] =
        useState<Nullable<GestureStateChangeEvent<TapGestureHandlerEventPayload>>>(null);

    const [realImg, setRealImg] = useState<SkImage>(img);

    const [activeTool, setActiveTool] = useState<TOOLS>(TOOLS.PEN);

    const [temporaryRectangle, setTemporaryRectangle] = useState<Nullable<{ outer: SkRRect; inner: SkRRect }>>(null);
    const [temporaryLine, setTemporaryLine] =
        useState<Nullable<{ start: { x: number; y: number }; end: { x: number; y: number }; cellSize: number }>>(null);

    const pressTool = useCallback((data: TOOLS) => setActiveTool(data), []);

    // shared
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const viewScale = useSharedValue(1);

    // const
    const { width, height } = useMemo(() => core.envSetup.getContentContainer, []);

    const { gridWidth, gridHeight } = useMemo(() => core.gridManager.getGridParam, []);

    const [gridParam, setGridParam] = useState({ isVisible: false, gridWidth, gridHeight });

    useEffect(() => {
        core.drawingManager.setActiveTool = activeTool;
    }, [activeTool, core]);

    const handleCloseRadiusModal = useCallback(() => {
        setRadius(1);
        setPenCircleEventValue(null);
    }, []);

    const tap = Gesture.Tap()
        .runOnJS(true)
        .onEnd(e => {
            if (activeTool === TOOLS.CIRCLE) {
                setPenCircleEventValue(e);
                return;
            }
            const value = core.drawingManager.tapAction(e);

            setRealImg(value);

            setIsHistoryAvailable({ back: true, forward: false });
        });

    const handlePan = useCallback(
        (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
            const val = core.gestureManager.visualizationDrawingRectangle(event);

            if (val === null) {
                return;
            }

            setTemporaryRectangle(val);
        },
        [core],
    );

    const handlePanLine = useCallback(
        (event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) => {
            const val = core.gestureManager.visualizationDrawingLine(event);

            if (val === null) {
                return;
            }

            setTemporaryLine(val);
        },
        [core],
    );

    const setNewImgByChangeCenter = useCallback(
        (newImg: SkImage) => {
            setIsChangeCenterOpen(false);
            core.imageManager.setNewImg(newImg);
            setRealImg(newImg);
        },
        [core],
    );

    const throttledPanHandler = useMemo(() => throttle(handlePan, ANIMATION_TIMEOUT_THROTTLE), [handlePan]);
    const throttledPanLineHandler = useMemo(() => throttle(handlePanLine, ANIMATION_TIMEOUT_THROTTLE), [handlePanLine]);

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

    const circleTap = useCallback(() => {
        if (penCircleEventValue) {
            const value = core.drawingManager.circleTapAction(penCircleEventValue, Math.floor(radius));
            handleCloseRadiusModal();
            setRealImg(value);

            setIsHistoryAvailable({ back: true, forward: false });
        }
    }, [penCircleEventValue, core, radius, handleCloseRadiusModal]);

    const panOneG = Gesture.Pan()
        .maxPointers(1)
        .runOnJS(true)
        .onStart(e => {
            if (activeTool === TOOLS.RECTANGLE) {
                core.gestureManager.startDrawRectangle(e);
                return;
            }
            if (activeTool === TOOLS.LINE) {
                core.gestureManager.startDrawLine(e);
                return;
            }
            core.gestureManager.panGStart();
        })
        .onChange(event => {
            if (activeTool === TOOLS.RECTANGLE) {
                throttledPanHandler(event);
                return;
            }

            if (activeTool === TOOLS.LINE) {
                throttledPanLineHandler(event);
                return;
            }

            const value = core.gestureManager.panAction(event);
            if (value === null) {
                return;
            }

            translateX.value = value.translateX;
            translateY.value = value.translateY;
        })
        .onEnd(e => {
            if (activeTool === TOOLS.RECTANGLE) {
                setTemporaryRectangle(null);

                if (e.numberOfPointers > 1) {
                    return;
                }
                const value = core.drawingManager.endDrawingRectangle(e);
                setRealImg(value);

                setIsHistoryAvailable({ back: true, forward: false });
            }
            if (activeTool === TOOLS.LINE) {
                setTemporaryLine(null);
                if (e.numberOfPointers > 1) {
                    return;
                }
                const value = core.drawingManager.endDrawingLine(e);
                setRealImg(value);
                setIsHistoryAvailable({ back: true, forward: false });
            }
        });

    const panG = Gesture.Pan()
        .enabled(activeTool === TOOLS.LINE || activeTool === TOOLS.RECTANGLE)
        .minPointers(2)
        .averageTouches(true)
        .runOnJS(true)
        .onStart(() => {
            if (temporaryRectangle === null && temporaryLine === null) {
                core.gestureManager.panGStart();
            }
        })
        .onChange(event => {
            if (activeTool !== TOOLS.LINE && activeTool !== TOOLS.RECTANGLE) {
                return;
            }
            const value = core.gestureManager.panAction(event);
            if (value === null) {
                return;
            }

            translateX.value = value.translateX;
            translateY.value = value.translateY;
        });

    const goBackHistory = useCallback(() => {
        const value = core.imageManager.goBackHistory();
        const { goBack, goForward } = core.imageManager.isHistoryAvailable;
        setIsHistoryAvailable({ back: goBack, forward: goForward });
        setRealImg(value);
    }, [core]);
    const goForwardHistory = useCallback(() => {
        const value = core.imageManager.goForwardHistory();
        const { goBack, goForward } = core.imageManager.isHistoryAvailable;
        setIsHistoryAvailable({ back: goBack, forward: goForward });
        setRealImg(value);
    }, [core]);

    const handleFinish = useCallback(async () => {
        setNewImg(realImg.encodeToBase64(ImageFormat.PNG, 1));
    }, [realImg, setNewImg]);

    const gesture = Gesture.Race(Gesture.Simultaneous(pinchGestureEvent, panOneG), tap, panG);

    const transformParams = useDerivedValue(
        () => [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: viewScale.value }],
        [viewScale, translateY, translateX],
    );

    return (
        <Container>
            <VisibleContentContainer>
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
                                <Group transform={transformParams}>
                                    <Image image={realImg} x={0} y={0} width={width} height={height} />
                                </Group>

                                {temporaryRectangle && (
                                    <DiffRect
                                        inner={temporaryRectangle.inner}
                                        outer={temporaryRectangle.outer}
                                        color={colors.success}
                                    />
                                )}
                                {temporaryLine && (
                                    <Line
                                        style="stroke"
                                        p1={vec(temporaryLine.start.x, temporaryLine.start.y)}
                                        p2={vec(temporaryLine.end.x, temporaryLine.end.y)}
                                        strokeWidth={temporaryLine.cellSize}
                                        color={colors.success}
                                    />
                                )}
                            </Canvas>
                        </Animated.View>
                    </GestureDetector>
                </GestureHandlerRootView>
                {isCenterShown && (
                    <CenterImgContainer width={width} height={height} pointerEvents="none">
                        <Canvas
                            style={{
                                width,
                                height,
                                flex: 1,
                            }}>
                            <Group
                                transform={transformParams}
                                // TODO set as const
                                layer={
                                    <Paint>
                                        <ColorMatrix matrix={OpacityMatrix(0.5)} />
                                    </Paint>
                                }>
                                <Image image={centerImg} x={0} y={0} width={width} height={height} />
                            </Group>
                        </Canvas>
                    </CenterImgContainer>
                )}

                {gridParam.isVisible && (
                    <MemoGridLayout
                        width={gridParam.gridWidth}
                        height={gridParam.gridHeight}
                        totalWidth={width}
                        totalHeight={height}
                    />
                )}

                <ToolsContainer>
                    <PressableTool onPress={() => pressTool(TOOLS.PEN)}>
                        <PenSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.PEN ? colors.success : colors.l1ActiveEl}
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

                    <PressableTool onPress={() => pressTool(TOOLS.LINE)}>
                        <LineSvg
                            width={ICON_SIZE * rem}
                            height={ICON_SIZE * rem}
                            fillColor={activeTool === TOOLS.LINE ? colors.success : colors.l1ActiveEl}
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
                <CenterControllerContainer>
                    <CenterControllerButton onPress={toggleIsCenterShown}>
                        <TextSemiBold20>{isCenterShown ? 'Hide center' : 'Show center'}</TextSemiBold20>
                    </CenterControllerButton>
                    <CenterControllerButton onPress={toggleIsChangeCenterOpen}>
                        <TextSemiBold20>Set center</TextSemiBold20>
                    </CenterControllerButton>
                </CenterControllerContainer>

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
                            onChangeText={val => setRadius(+val)}
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
            <SetCenterModal
                img={realImg}
                isVisible={isChangeCenterOpen}
                backButtonHandler={toggleIsChangeCenterOpen}
                acceptAction={setNewImgByChangeCenter}
            />
        </Container>
    );
};
