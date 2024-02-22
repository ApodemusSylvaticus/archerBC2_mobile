import {
    GestureStateChangeEvent,
    GestureUpdateEvent,
    PanGestureChangeEventPayload,
    PanGestureHandlerEventPayload,
    PinchGestureChangeEventPayload,
    PinchGestureHandlerEventPayload,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { rect, rrect, SkRRect } from '@shopify/react-native-skia';
import { Nullable } from '@/interface/helper';
import { GridManager } from '@/core/pixelEditor/GridManager';
import { EnvSetup } from '@/core/pixelEditor/EnvSetup';

import { closestLeftThird } from '@/helpers/pixelEditor';

export class GestureManager {
    private gridManager: GridManager;

    private envSetup: EnvSetup;

    private scale = 1;

    private scaleLine: number[] = [];

    private startPositionDrawingRect: { x: number; y: number; realX: number; realY: number } = {
        x: 0,
        y: 0,
        realX: 0,
        realY: 0,
    };

    private startPositionDrawingLine: { x: number; y: number; realX: number; realY: number } = {
        x: 0,
        y: 0,
        realX: 0,
        realY: 0,
    };

    private lastValueDrawingRect: { x: number; y: number } = { x: 0, y: 0 };

    private lastValueDrawingLine: { x: number; y: number } = { x: 0, y: 0 };

    private actualPosition = { x: 0, y: 0 };

    private actualScaleIndex = 0;

    private start = { x: 0, y: 0 };

    private isTempRectShouldDraw = false;

    private isTempLineShouldDraw = false;

    get getStartPositionDrawingRect() {
        return this.startPositionDrawingRect;
    }

    get getStartPositionDrawingLine() {
        return this.startPositionDrawingLine;
    }

    resetAllValue() {
        this.scale = 0;
        this.actualScaleIndex = 0;
        this.actualPosition = { x: 0, y: 0 };
        this.start = { x: 0, y: 0 };
    }

    get cellSize() {
        const cellSizeLine = this.gridManager.getCellSizeLine;
        return cellSizeLine[this.actualScaleIndex];
    }

    constructor(gridManager: GridManager, envSetup: EnvSetup) {
        this.gridManager = gridManager;
        this.envSetup = envSetup;
        this.setupScaleLine();
    }

    setupScaleLine() {
        const closestDivisor = this.gridManager.getClosestDivisor;
        this.scaleLine = [
            1,
            closestDivisor / 16,
            closestDivisor / 8,
            closestDivisor / 4,
            closestDivisor / 2,
            closestDivisor,
            closestDivisor * 2,
        ];
    }

    panAction(
        event: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
    ): Nullable<{ translateX: number; translateY: number }> {
        if (this.scaleLine[this.actualScaleIndex] === 1) {
            return null;
        }
        const { width, height } = this.envSetup.getContentContainer;
        const xT = this.start.x + event.translationX;
        const yT = this.start.y + event.translationY;
        const remainderxT = xT % this.cellSize;
        const remainderyT = yT % this.cellSize;

        const closestxT = xT - remainderxT + this.cellSize;
        const closestyT = yT - remainderyT + this.cellSize;

        const maxPositionX = width * this.scaleLine[this.actualScaleIndex] - width;
        const maxPositionY = height * this.scaleLine[this.actualScaleIndex] - height;

        if (closestxT >= 0) {
            this.actualPosition.x = 0;
        } else if (Math.abs(closestxT) >= maxPositionX) {
            this.actualPosition.x = -maxPositionX;
        } else {
            this.actualPosition.x = closestxT;
        }

        if (closestyT >= 0) {
            this.actualPosition.y = 0;
        } else if (Math.abs(closestyT) >= maxPositionY) {
            this.actualPosition.y = -maxPositionY;
        } else {
            this.actualPosition.y = closestyT;
        }

        return { translateX: this.actualPosition.x, translateY: this.actualPosition.y };
    }

    pinchStart() {
        this.scale = 1;
    }

    pinchAction(event: GestureUpdateEvent<PinchGestureHandlerEventPayload & PinchGestureChangeEventPayload>) {
        const { width, height } = this.envSetup.getContentContainer;

        if (event.scale > 1) {
            if (event.scale >= this.scale + 0.5 && this.actualScaleIndex !== this.scaleLine.length - 1) {
                this.actualScaleIndex += 1;
                const maxPositionX = width * this.scaleLine[this.actualScaleIndex] - width;
                const maxPositionY = height * this.scaleLine[this.actualScaleIndex] - height;
                const xT = this.actualPosition.x * 2 - event.focalX;
                const yT = this.actualPosition.y * 2 - event.focalY;

                const remainderxT = xT % this.cellSize;
                const remainderyT = yT % this.cellSize;

                const actualxT = xT - remainderxT + this.cellSize;
                const actualyT = yT - remainderyT + this.cellSize;

                this.actualPosition = {
                    x: Math.abs(actualxT) >= maxPositionX ? -maxPositionX : actualxT,
                    y: Math.abs(actualyT) >= maxPositionY ? -maxPositionY : actualyT,
                };

                this.scale += 0.5;
                return {
                    translateX: this.actualPosition.x,
                    translateY: this.actualPosition.y,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
                };
            }

            if (event.scale <= this.scale - 0.5 && this.actualScaleIndex !== 0) {
                this.actualScaleIndex -= 1;

                const maxPositionX = width * this.scaleLine[this.actualScaleIndex] - width;
                const maxPositionY = height * this.scaleLine[this.actualScaleIndex] - height;
                if (this.actualScaleIndex === 0) {
                    this.actualPosition = {
                        x: 0,
                        y: 0,
                    };
                    return {
                        translateX: 0,
                        translateY: 0,
                        viewScale: this.scaleLine[this.actualScaleIndex],
                        gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
                    };
                }
                const xT = this.actualPosition.x / 2 + event.focalX / 2;
                const yT = this.actualPosition.y / 2 + event.focalY / 2;

                const remainderxT = xT % this.cellSize;
                const remainderyT = yT % this.cellSize;

                const actualxT = xT - remainderxT + this.cellSize;
                const actualyT = yT - remainderyT + this.cellSize;

                this.actualPosition = {
                    // eslint-disable-next-line no-nested-ternary
                    x: actualxT >= 0 ? 0 : Math.abs(actualxT) >= maxPositionX ? -maxPositionX : actualxT,
                    // eslint-disable-next-line no-nested-ternary
                    y: actualyT >= 0 ? 0 : Math.abs(actualyT) >= maxPositionY ? -maxPositionY : actualyT,
                };

                this.scale -= 0.5;
                return {
                    translateX: this.actualPosition.x,
                    translateY: this.actualPosition.y,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
                };
            }

            return null;
        }

        if (event.scale <= this.scale - 0.25 && this.actualScaleIndex !== 0) {
            this.actualScaleIndex -= 1;

            const maxPositionX = width * this.scaleLine[this.actualScaleIndex] - width;
            const maxPositionY = height * this.scaleLine[this.actualScaleIndex] - height;
            if (this.actualScaleIndex === 0) {
                this.actualPosition = {
                    x: 0,
                    y: 0,
                };
                return {
                    translateX: 0,
                    translateY: 0,
                    viewScale: this.scaleLine[this.actualScaleIndex],
                    gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
                };
            }

            const xT = this.actualPosition.x / 2 + event.focalX / 2;
            const yT = this.actualPosition.y / 2 + event.focalY / 2;

            const remainderxT = xT % this.cellSize;
            const remainderyT = yT % this.cellSize;

            const actualxT = xT - remainderxT + this.cellSize;
            const actualyT = yT - remainderyT + this.cellSize;

            this.actualPosition = {
                // eslint-disable-next-line no-nested-ternary
                x: actualxT >= 0 ? 0 : Math.abs(actualxT) >= maxPositionX ? -maxPositionX : actualxT,
                // eslint-disable-next-line no-nested-ternary
                y: actualyT >= 0 ? 0 : Math.abs(actualyT) >= maxPositionY ? -maxPositionY : actualyT,
            };

            this.scale -= 0.25;
            return {
                translateX: this.actualPosition.x,
                translateY: this.actualPosition.y,
                viewScale: this.scaleLine[this.actualScaleIndex],
                gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
            };
        }

        if (event.scale > this.scale + 0.25 && this.actualScaleIndex !== this.scaleLine.length - 1) {
            this.actualScaleIndex += 1;
            const maxPositionX = width * this.scaleLine[this.actualScaleIndex] - width;
            const maxPositionY = height * this.scaleLine[this.actualScaleIndex] - height;
            const xT = this.actualPosition.x * 2 - event.focalX;
            const yT = this.actualPosition.y * 2 - event.focalY;

            const remainderxT = xT % this.cellSize;
            const remainderyT = yT % this.cellSize;

            const actualxT = xT - remainderxT + this.cellSize;
            const actualyT = yT - remainderyT + this.cellSize;

            this.actualPosition = {
                x: Math.abs(actualxT) >= maxPositionX ? -maxPositionX : actualxT,
                y: Math.abs(actualyT) >= maxPositionY ? -maxPositionY : actualyT,
            };

            this.scale += 0.25;
            return {
                translateX: this.actualPosition.x,
                translateY: this.actualPosition.y,
                viewScale: this.scaleLine[this.actualScaleIndex],
                gridParam: this.gridManager.getGridLineParam[this.actualScaleIndex],
            };
        }

        return null;
    }

    panGStart() {
        this.start = { x: this.actualPosition.x, y: this.actualPosition.y };
    }

    startDrawRectangle(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) {
        this.isTempRectShouldDraw = true;
        const { x, y } = this.baseTapAction(e);
        this.startPositionDrawingRect = {
            realX: x,
            realY: y,
            x: Math.floor(e.x / this.cellSize) * this.cellSize,
            y: Math.floor(e.y / this.cellSize) * this.cellSize,
        };
        this.lastValueDrawingRect = {
            x: Math.floor(e.x / this.cellSize) * this.cellSize,
            y: Math.floor(e.y / this.cellSize) * this.cellSize,
        };
    }

    visualizationDrawingRectangle(
        e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>,
    ): Nullable<{ outer: SkRRect; inner: SkRRect }> {
        if (this.isTempRectShouldDraw === false) {
            return null;
        }

        const { x, y } = e;

        if (
            Math.abs(this.lastValueDrawingRect.x - x) < this.cellSize &&
            Math.abs(this.lastValueDrawingRect.y - y) < this.cellSize
        ) {
            return null;
        }

        const start = this.startPositionDrawingRect;

        const roundedX = Math.floor(x / this.cellSize) * this.cellSize;
        const roundedY = Math.floor(y / this.cellSize) * this.cellSize;

        const visibleStart = {
            x: Math.min(start.x, roundedX),
            y: Math.min(start.y, roundedY),
        };

        const lengthOx = Math.abs(start.x - roundedX) / this.cellSize + 1;
        const lengthOy = Math.abs(start.y - roundedY) / this.cellSize + 1;

        const outer = rrect(
            rect(visibleStart.x, visibleStart.y, lengthOx * this.cellSize, lengthOy * this.cellSize),
            0,
            0,
        );
        const inner =
            lengthOx > 2 && lengthOy > 2
                ? rrect(
                      rect(
                          visibleStart.x + this.cellSize,
                          visibleStart.y + this.cellSize,
                          (lengthOx - 2) * this.cellSize,
                          (lengthOy - 2) * this.cellSize,
                      ),
                      0,
                      0,
                  )
                : rrect(rect(0, 0, 0, 0), 0, 0);

        this.lastValueDrawingRect = { x: roundedX, y: roundedY };
        return { outer, inner };
    }

    startDrawLine(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) {
        this.isTempLineShouldDraw = true;
        const { x, y } = this.baseTapAction(e);

        this.startPositionDrawingLine = {
            realX: x,
            realY: y,
            x: Math.floor(e.x / this.cellSize) * this.cellSize,
            y: Math.floor(e.y / this.cellSize) * this.cellSize,
        };

        this.lastValueDrawingLine = {
            x: Math.floor(e.x / this.cellSize) * this.cellSize,
            y: Math.floor(e.y / this.cellSize) * this.cellSize,
        };
    }

    visualizationDrawingLine(e: GestureUpdateEvent<PanGestureHandlerEventPayload & PanGestureChangeEventPayload>) {
        if (this.isTempLineShouldDraw === false) {
            return null;
        }

        let { x, y } = e;
        x = x > 0 ? x : 0;
        y = y > 0 ? y : 0;
        const start = this.startPositionDrawingLine;
        if (Math.abs(start.x - x) > Math.abs(start.y - y)) {
            return this.drawLineOx(x);
        }
        return this.drawLineOy(y);
    }

    drawLineOx(x: number) {
        const start = this.startPositionDrawingLine;

        if (x > this.lastValueDrawingLine.x && x - this.lastValueDrawingLine.x <= this.cellSize) {
            return null;
        }

        const roundedX = Math.floor(x / this.cellSize) * this.cellSize;

        this.lastValueDrawingLine = { x: roundedX, y: this.lastValueDrawingLine.y };

        return {
            start: { x: start.x > roundedX ? start.x + this.cellSize : start.x, y: start.y + this.cellSize / 2 },
            end: { x: roundedX > start.x ? roundedX + this.cellSize : roundedX, y: start.y + this.cellSize / 2 },
            cellSize: this.cellSize,
        };
    }

    drawLineOy(y: number) {
        const start = this.startPositionDrawingLine;

        if (y > this.lastValueDrawingLine.y && y - this.lastValueDrawingLine.y <= this.cellSize) {
            return null;
        }

        const roundedY = Math.floor(y / this.cellSize) * this.cellSize;

        this.lastValueDrawingLine = { x: this.lastValueDrawingLine.x, y: roundedY };

        return {
            start: { x: start.x + this.cellSize / 2, y: start.y > roundedY ? start.y + this.cellSize : start.y },
            end: { x: start.x + this.cellSize / 2, y: roundedY > start.y ? roundedY + this.cellSize : roundedY },
            cellSize: this.cellSize,
        };
    }

    baseTapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) {
        const xPos = (e.x + this.actualPosition.x * -1) / this.scaleLine[this.actualScaleIndex];
        const yPos = (e.y + this.actualPosition.y * -1) / this.scaleLine[this.actualScaleIndex];

        const realImgParam = this.envSetup.getRealImgParam;
        const contentContainer = this.envSetup.getContentContainer;

        const x = closestLeftThird((xPos * realImgParam.width) / contentContainer.width);
        const y = closestLeftThird((yPos * realImgParam.height) / contentContainer.height);

        return { x, y };
    }
}
