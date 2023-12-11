import { PixelRatio } from 'react-native';
import { rect, rrect, SkImage, SkRRect } from '@shopify/react-native-skia';
import {
    GestureStateChangeEvent,
    GestureUpdateEvent,
    PanGestureChangeEventPayload,
    PanGestureHandlerEventPayload,
    PinchGestureChangeEventPayload,
    PinchGestureHandlerEventPayload,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { getWindowWidth } from '@/helpers/getWindowParam';
import { Nullable } from '@/interface/helper';
import { IRect, TOOLS } from '@/interface/components/pixelEditor';

export class PixelEditorCore {
    private readonly pixelRatio;

    private readonly contentContainer;

    private readonly realImgParam;

    private readonly gridParam;

    private scale = 1;

    private actualPosition = { x: 0, y: 0 };

    private scaleLine: number[] = [];

    private cellSizeLine: number[] = [];

    private actualScaleIndex = 0;

    private start = { x: 0, y: 0 };

    private activeTool: TOOLS = TOOLS.PEN;

    get isHistoryAvailable() {
        return { goBack: this.historyIndex > 0, goForward: this.historyIndex < this.history.length - 1 };
    }

    private history: SkImage[] = [];

    private historyIndex: number = 0;

    goBackHistory() {
        if (this.historyIndex === 0) {
            throw new Error('Trying to goBackHistory, but history index === 0');
        }
        this.historyIndex -= 1;
        return this.history[this.historyIndex];
    }

    goForwardHistory() {
        if (this.historyIndex === this.history.length - 1) {
            throw new Error('Trying to goForwardHistory, but history index === history length - 1');
        }
        this.historyIndex += 1;
        return this.history[this.historyIndex];
    }

    setImgToHistory(img: SkImage) {
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(img);
            this.historyIndex += 1;
            return;
        }
        if (this.history.length === 5) {
            this.history.shift();
            this.history.push(img);
            return;
        }
        this.history.push(img);
        this.historyIndex += 1;
    }

    set setActiveTool(tool: TOOLS) {
        this.activeTool = tool;
    }

    drawEllipse(centerX: number, centerY: number, radius: number) {
        const pixels = [];
        const size = 1 / this.pixelRatio;

        let x = 0;
        let y = radius;
        let delta = 1 - 2 * radius;
        let error = 0;

        while (y >= x) {
            pixels.push({ x: (centerX + x) / 3, y: (centerY + y) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX + x) / 3, y: (centerY - y) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX - x) / 3, y: (centerY + y) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX - x) / 3, y: (centerY - y) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX + y) / 3, y: (centerY + x) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX + y) / 3, y: (centerY - x) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX - y) / 3, y: (centerY + x) / 3, color: 'rgb(0, 0, 0)', size });
            pixels.push({ x: (centerX - y) / 3, y: (centerY - x) / 3, color: 'rgb(0, 0, 0)', size });

            error = 2 * (delta + y) - 1;

            if (delta < 0 && error <= 0) {
                // eslint-disable-next-line no-plusplus
                delta += 2 * ++x + 1;
                // eslint-disable-next-line no-continue
                continue;
            }

            if (delta > 0 && error > 0) {
                // eslint-disable-next-line no-plusplus
                delta -= 2 * --y + 1;
                // eslint-disable-next-line no-continue
                continue;
            }

            // eslint-disable-next-line no-plusplus
            delta += 2 * (++x - --y);
        }

        return pixels;
    }

    panGStart() {
        this.start = { x: this.actualPosition.x, y: this.actualPosition.y };
    }

    closestLeftThird = (value: number): number => {
        const integerPart = Math.floor(value);
        const decimalPart = value - integerPart;

        for (let i = this.pixelRatio - 1; i > 0; i -= 1) {
            if (decimalPart > i / this.pixelRatio) {
                return integerPart + i / this.pixelRatio;
            }
        }

        return integerPart;
    };

    get getContentContainer() {
        return this.contentContainer;
    }

    get getRealImgParam() {
        return this.realImgParam;
    }

    get getGridParam() {
        return this.gridParam;
    }

    constructor(baseImg: SkImage) {
        this.pixelRatio = PixelRatio.get();
        const windowWidth = getWindowWidth();
        this.contentContainer = {
            width: windowWidth,
            height: (windowWidth * 3) / 4,
        };

        this.realImgParam = { width: baseImg.width() / this.pixelRatio, height: baseImg.height() / this.pixelRatio };
        this.gridParam = { gridWidth: 16, gridHeight: 12 };

        const closestDivisor = baseImg.width() / this.gridParam.gridWidth;

        this.setupScaleLine(closestDivisor);
    }

    private gridLineParam: { width: number; height: number; isVisible: boolean }[] = [];

    setupScaleLine(closestDivisor: number) {
        this.scaleLine = [
            1,
            closestDivisor / 16,
            closestDivisor / 8,
            closestDivisor / 4,
            closestDivisor / 2,
            closestDivisor,
            closestDivisor * 2,
        ];
        const cellSize = this.contentContainer.width / this.gridParam.gridWidth;

        this.cellSizeLine = [
            cellSize / 32,
            cellSize / 16,
            cellSize / 8,
            cellSize / 4,
            cellSize / 2,
            cellSize,
            cellSize * 2,
        ];

        this.gridLineParam = [
            { width: 0, height: 0, isVisible: false },
            { width: 0, height: 0, isVisible: false },
            { width: 0, height: 0, isVisible: false },
            { width: 0, height: 0, isVisible: false },
            { width: this.gridParam.gridWidth * 2, height: this.gridParam.gridHeight * 2, isVisible: true },
            { width: this.gridParam.gridWidth, height: this.gridParam.gridHeight, isVisible: true },
            { width: this.gridParam.gridWidth / 2, height: this.gridParam.gridHeight / 2, isVisible: true },
        ];
    }

    baseTapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) {
        const xPos = (e.x + this.actualPosition.x * -1) / this.scaleLine[this.actualScaleIndex];
        const yPos = (e.y + this.actualPosition.y * -1) / this.scaleLine[this.actualScaleIndex];
        const x = this.closestLeftThird((xPos * this.realImgParam.width) / this.contentContainer.width);
        const y = this.closestLeftThird((yPos * this.realImgParam.height) / this.contentContainer.height);
        const size = 1 / this.pixelRatio;
        return { x, y, size };
    }

    tapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) {
        const { x, y, size } = this.baseTapAction(e);
        switch (this.activeTool) {
            case TOOLS.RECTANGLE:
            case TOOLS.PEN:
            case TOOLS.RUBBER:
                return [
                    { x, y, size, color: this.activeTool === TOOLS.RUBBER ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)' },
                ];
            case TOOLS.CIRCLE:
                throw new Error('Here should trigger circleTapAction');
            default:
                throw new Error('Unknown activeTool');
        }
    }

    circleTapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>, radius: number) {
        const { x, y } = this.baseTapAction(e);

        return this.drawEllipse(x * this.pixelRatio, y * this.pixelRatio, radius);
    }

    private startPositionDrawingRect: { x: number; y: number; realX: number; realY: number } = {
        x: 0,
        y: 0,
        realX: 0,
        realY: 0,
    };

    get getStartPositionDrawingRect() {
        return this.startPositionDrawingRect;
    }

    startDrawRectangle(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) {
        const { x, y } = this.baseTapAction(e);
        this.startPositionDrawingRect = {
            realX: x,
            realY: y,
            x: Math.floor(e.x / this.getCellSize) * this.getCellSize,
            y: Math.floor(e.y / this.getCellSize) * this.getCellSize,
        };
        this.lastValueDrawing = {
            x: Math.floor(e.x / this.getCellSize) * this.getCellSize,
            y: Math.floor(e.y / this.getCellSize) * this.getCellSize,
        };
    }

    get getCellSize() {
        return this.cellSizeLine[this.actualScaleIndex];
    }

    endDrawingRectangle(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) {
        const res: IRect[] = [];
        const { x, y, size } = this.baseTapAction(e);
        const { realX, realY } = this.startPositionDrawingRect;
        const startOx = Math.min(x, realX);
        const startOy = Math.min(y, realY);
        const endOx = Math.max(x, realX);
        const endOy = Math.max(y, realY);

        for (let i = startOx; i <= endOx; i += size) {
            res.push({ x: i, y: startOy, size, color: 'black' });
            res.push({ x: i, y: endOy, size, color: 'black' });
        }
        for (let i = startOy; i < endOy; i += size) {
            res.push({ x: startOx, y: i, size, color: 'black' });
            res.push({ x: endOx, y: i, size, color: 'black' });
        }
        return res;
    }

    private lastValueDrawing: { x: number; y: number } = { x: 0, y: 0 };

    visualizationDrawingRectangle(
        e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
    ): Nullable<{ outer: SkRRect; inner: SkRRect }> {
        const { x, y } = e;
        const cellSize = this.getCellSize;

        if (Math.abs(this.lastValueDrawing.x - x) < cellSize && Math.abs(this.lastValueDrawing.y - y) < cellSize) {
            return null;
        }
        const start = this.getStartPositionDrawingRect;

        const roundedX = Math.floor(x / cellSize) * cellSize;
        const roundedY = Math.floor(y / cellSize) * cellSize;

        const visibleStart = {
            x: Math.min(start.x, roundedX),
            y: Math.min(start.y, roundedY),
        };

        const lengthOx = Math.abs(start.x - roundedX) / cellSize + 1;
        const lengthOy = Math.abs(start.y - roundedY) / cellSize + 1;

        const outer = rrect(rect(visibleStart.x, visibleStart.y, lengthOx * cellSize, lengthOy * cellSize), 0, 0);
        const inner =
            lengthOx > 2 && lengthOx > 2
                ? rrect(
                      rect(
                          visibleStart.x + cellSize,
                          visibleStart.y + cellSize,
                          (lengthOx - 2) * cellSize,
                          (lengthOy - 2) * cellSize,
                      ),
                      0,
                      0,
                  )
                : rrect(rect(0, 0, 0, 0), 0, 0);

        this.lastValueDrawing = { x: roundedX, y: roundedY };
        return { outer, inner };
    }

    panAction(
        event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
    ): Nullable<{ translateX: number; translateY: number }> {
        if (this.scaleLine[this.actualScaleIndex] === 1) {
            return null;
        }

        const xT = this.start.x + event.translationX;
        const yT = this.start.y + event.translationY;
        const cellSize = this.cellSizeLine[this.actualScaleIndex];
        const remainderxT = xT % cellSize;
        const remainderyT = yT % cellSize;
        const closestxT = remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + cellSize;
        const closestyT = remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + cellSize;

        this.actualPosition.x = closestxT >= 0 ? 0 : closestxT;
        this.actualPosition.y = closestyT >= 0 ? 0 : closestyT;

        return { translateX: closestxT >= 0 ? 0 : closestxT, translateY: closestyT >= 0 ? 0 : closestyT };
    }

    pinchStart() {
        this.scale = 1;
    }

    pinchAction(event: GestureUpdateEvent<PinchGestureHandlerEventPayload & PinchGestureChangeEventPayload>) {
        if (event.scale > 1) {
            if (event.scale >= this.scale + 0.5 && this.actualScaleIndex !== this.scaleLine.length - 1) {
                this.actualScaleIndex += 1;

                const cellSize = this.cellSizeLine[this.actualScaleIndex];
                const xT = this.actualPosition.x * 2 - event.focalX;
                const yT = this.actualPosition.y * 2 - event.focalY;

                const remainderxT = xT % cellSize;
                const remainderyT = yT % cellSize;

                this.actualPosition = {
                    x: remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + cellSize,
                    y: remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + cellSize,
                };

                this.scale += 0.5;
                return {
                    translateX: this.actualPosition.x,
                    translateY: this.actualPosition.y,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridLineParam[this.actualScaleIndex],
                };
            }

            if (event.scale <= this.scale - 0.5 && this.actualScaleIndex !== 0) {
                this.actualScaleIndex -= 1;

                if (this.actualScaleIndex === 0) {
                    this.actualPosition = {
                        x: 0,
                        y: 0,
                    };
                    return {
                        translateX: 0,
                        translateY: 0,
                        viewScale: this.scaleLine[this.actualScaleIndex],
                        gridParam: this.gridLineParam[this.actualScaleIndex],
                    };
                }
                const cellSize = this.cellSizeLine[this.actualScaleIndex];
                const xT = this.actualPosition.x / 2 + event.focalX / 2;
                const yT = this.actualPosition.y / 2 + event.focalY / 2;

                const remainderxT = xT % cellSize;
                const remainderyT = yT % cellSize;

                this.actualPosition = {
                    x: remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + cellSize,
                    y: remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + cellSize,
                };

                this.scale -= 0.5;
                return {
                    translateX: this.actualPosition.x,
                    translateY: this.actualPosition.y,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridLineParam[this.actualScaleIndex],
                };
            }

            return null;
        }

        if (event.scale <= this.scale - 0.25 && this.actualScaleIndex !== 0) {
            this.actualScaleIndex -= 1;
            if (this.actualScaleIndex === 0) {
                this.actualPosition = {
                    x: 0,
                    y: 0,
                };
                return {
                    translateX: 0,
                    translateY: 0,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridLineParam[this.actualScaleIndex],
                };
            }

            const cellSize = this.cellSizeLine[this.actualScaleIndex];
            const xT = this.actualPosition.x / 2 + event.focalX / 2;
            const yT = this.actualPosition.y / 2 + event.focalY / 2;

            const remainderxT = xT % cellSize;
            const remainderyT = yT % cellSize;

            this.actualPosition = {
                x: remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + cellSize,
                y: remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + cellSize,
            };

            this.scale -= 0.25;
            return {
                translateX: this.actualPosition.x,
                translateY: this.actualPosition.y,
                viewScale: this.scaleLine[this.actualScaleIndex],
                gridParam: this.gridLineParam[this.actualScaleIndex],
            };
        }

        if (event.scale > this.scale + 0.25 && this.actualScaleIndex !== this.scaleLine.length - 1) {
            this.actualScaleIndex += 1;

            const cellSize = this.cellSizeLine[this.actualScaleIndex];
            const xT = this.actualPosition.x * 2 - event.focalX;
            const yT = this.actualPosition.y * 2 - event.focalY;

            const remainderxT = xT % cellSize;
            const remainderyT = yT % cellSize;

            this.actualPosition = {
                x: remainderxT >= 0 ? xT - remainderxT : xT - remainderxT + cellSize,
                y: remainderyT >= 0 ? yT - remainderyT : yT - remainderyT + cellSize,
            };

            this.scale += 0.25;
            return {
                translateX: this.actualPosition.x,
                translateY: this.actualPosition.y,
                viewScale: this.scaleLine[this.actualScaleIndex],
                gridParam: this.gridLineParam[this.actualScaleIndex],
            };
        }

        return null;
    }
}
