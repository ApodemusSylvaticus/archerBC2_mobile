import {
    GestureStateChangeEvent,
    PanGestureHandlerEventPayload,
    TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { SkImage } from '@shopify/react-native-skia';
import { ImageManager } from './ImageManager';
import { assertNever } from '@/interface/helper';
import { GridManager } from '@/core/pixelEditor/GridManager';
import { TOOLS } from '@/interface/components/pixelEditor';
import { GestureManager } from '@/core/pixelEditor/GestureManager';
import { IPixel } from '@/interface/core/pixelEditor';
import { removeDuplicatesFromPixels } from '@/helpers/pixelEditor';

export class DrawingManager {
    private activeTool: TOOLS = TOOLS.PEN;

    private imageManager: ImageManager;

    private gestureManager: GestureManager;

    private gridManager: GridManager;

    set setActiveTool(tool: TOOLS) {
        this.activeTool = tool;
    }

    constructor(imageManager: ImageManager, gridManager: GridManager, gestureManager: GestureManager) {
        this.imageManager = imageManager;
        this.gridManager = gridManager;
        this.gestureManager = gestureManager;
    }

    drawCircle(centerX: number, centerY: number, radius: number) {
        const pixels: IPixel[] = [];

        let x = 0;
        let y = radius;
        let delta = 1 - 2 * radius;
        let error = 0;

        while (y >= x) {
            pixels.push({
                x: (centerX + x) * this.gridManager.getPixelSize,
                y: (centerY + y) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX + x) * this.gridManager.getPixelSize,
                y: (centerY - y) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX - x) * this.gridManager.getPixelSize,
                y: (centerY + y) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX - x) * this.gridManager.getPixelSize,
                y: (centerY - y) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX + y) * this.gridManager.getPixelSize,
                y: (centerY + x) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX + y) * this.gridManager.getPixelSize,
                y: (centerY - x) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX - y) * this.gridManager.getPixelSize,
                y: (centerY + x) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });
            pixels.push({
                x: (centerX - y) * this.gridManager.getPixelSize,
                y: (centerY - x) * this.gridManager.getPixelSize,
                color: { r: 0, g: 0, b: 0 },
            });

            error = 2 * (delta + y) - 1;

            if (delta < 0 && error <= 0) {
                delta += 2 * ++x + 1;
                // eslint-disable-next-line no-continue
                continue;
            }

            if (delta > 0 && error > 0) {
                delta -= 2 * --y + 1;
                // eslint-disable-next-line no-continue
                continue;
            }

            delta += 2 * (++x - --y);
        }

        return this.imageManager.setPixelsToImg(removeDuplicatesFromPixels(pixels));
    }

    circleTapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>, radius: number) {
        const { x, y } = this.gestureManager.baseTapAction(e);

        return this.drawCircle(x * this.gridManager.getPixelRatio, y * this.gridManager.getPixelRatio, radius);
    }

    endDrawingRectangle(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): SkImage {
        this.gestureManager.finishDrawTempRect();
        const { x, y } = this.gestureManager.baseTapAction(e);
        const data: IPixel[] = [];
        const { realX, realY } = this.gestureManager.getStartPositionDrawingRect;
        const startOx = Math.min(x, realX);
        const startOy = Math.min(y, realY);
        const endOx = Math.max(x, realX);
        const endOy = Math.max(y, realY);
        const lengthOx = Math.round((endOx - startOx) / this.gridManager.getPixelSize) + 1;
        const lengthOy = Math.round((endOy - startOy) / this.gridManager.getPixelSize) - 1;

        for (let i = 0; i < lengthOx; i += 1) {
            data.push({ x: startOx + i * this.gridManager.getPixelSize, y: startOy, color: { r: 0, g: 0, b: 0 } });
            data.push({ x: startOx + i * this.gridManager.getPixelSize, y: endOy, color: { r: 0, g: 0, b: 0 } });
        }

        for (let i = 1; i <= lengthOy; i += 1) {
            data.push({ x: startOx, y: startOy + i * this.gridManager.getPixelSize, color: { r: 0, g: 0, b: 0 } });
            data.push({ x: endOx, y: startOy + i * this.gridManager.getPixelSize, color: { r: 0, g: 0, b: 0 } });
        }

        return this.imageManager.setPixelsToImg(data);
    }

    endDrawingLine(e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): SkImage {
        this.gestureManager.finishDrawTempLine();
        const { x, y } = this.gestureManager.baseTapAction(e);
        const data: IPixel[] = [];
        const { realX, realY } = this.gestureManager.getStartPositionDrawingLine;

        const xChange = Math.abs(realX - x);
        const yChange = Math.abs(realY - y);

        const maxChange = Math.max(xChange, yChange);

        const length = Math.round(maxChange / this.gridManager.getPixelSize) + 1;

        if (xChange === maxChange) {
            const start = Math.min(realX, x);

            for (let i = 0; i < length; i += 1) {
                data.push({ x: start + i * this.gridManager.getPixelSize, y: realY, color: { r: 0, g: 0, b: 0 } });
            }
        } else {
            const start = Math.min(realY, y);

            for (let i = 0; i < length; i += 1) {
                data.push({ x: realX, y: start + i * this.gridManager.getPixelSize, color: { r: 0, g: 0, b: 0 } });
            }
        }

        return this.imageManager.setPixelsToImg(data);
    }

    // eslint-disable-next-line consistent-return
    tapAction(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) {
        const { x, y } = this.gestureManager.baseTapAction(e);
        switch (this.activeTool) {
            case TOOLS.RECTANGLE:
            case TOOLS.PEN:
            case TOOLS.LINE:
                return this.imageManager.setPixelsToImg([{ x, y }]);
            case TOOLS.CIRCLE:
                throw new Error('Here should trigger circleTapAction');
            default:
                assertNever(this.activeTool);
        }
    }
}
