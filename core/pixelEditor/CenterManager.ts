import { AlphaType, ColorType, Skia } from '@shopify/react-native-skia';
import { GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { GestureManager } from '@/core/pixelEditor/GestureManager';
import { ImageManager } from '@/core/pixelEditor/ImageManager';
import { EnvSetup } from '@/core/pixelEditor/EnvSetup';
import { GridManager } from '@/core/pixelEditor/GridManager';

export class CenterManager {
    private readonly visualCenterArray: Uint8Array;

    private readonly imageManager: ImageManager;

    private readonly gestureManager: GestureManager;

    private readonly envSetup: EnvSetup;

    private readonly gridManager: GridManager;

    constructor(
        envSetup: EnvSetup,
        gestureManager: GestureManager,
        imageManager: ImageManager,
        gridManager: GridManager,
    ) {
        this.gridManager = gridManager;
        this.envSetup = envSetup;
        this.gestureManager = gestureManager;
        this.imageManager = imageManager;
        this.visualCenterArray = imageManager.getImgUint8Array.map(() => 0);

        this.drawCenter({
            x: Math.floor(envSetup.getMakeImgParam.width / 2),
            y: Math.floor(envSetup.getMakeImgParam.height / 2),
        });
    }

    setCenter(e: GestureStateChangeEvent<TapGestureHandlerEventPayload>) {
        const { x, y } = this.gestureManager.baseTapAction(e);
        return this.cutExtraCenter({ x, y });
    }

    cutExtraCenter({ x, y }: { x: number; y: number }) {
        const { width: realWidth, height: realHeight } = this.envSetup.getRealImgParam;
        const width = realWidth * this.gridManager.getPixelRatio;
        const height = realHeight * this.gridManager.getPixelRatio;
        const realX = Math.floor(x / this.gridManager.getPixelSize);
        const realY = Math.floor(y / this.gridManager.getPixelSize);

        const center = { x: Math.floor(width / 2), y: Math.floor(height / 2) };

        const startX = realX - center.x;
        const startY = realY - center.y;

        const pixels = new Uint8Array(height * width * 4);
        pixels.fill(255);

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                const newIndex = i * width * 4 + j * 4;

                if (startX + j >= width || startY + i >= height || startX + j < 0 || startY + i < 0) {
                    // eslint-disable-next-line no-continue
                    continue;
                }

                const prevImgIndex = (startY + i) * width * 4 + (startX + j) * 4;

                pixels[newIndex] = this.imageManager.getImgUint8Array[prevImgIndex];
                pixels[newIndex + 1] = this.imageManager.getImgUint8Array[prevImgIndex + 1];
                pixels[newIndex + 2] = this.imageManager.getImgUint8Array[prevImgIndex + 2];
                pixels[newIndex + 3] = this.imageManager.getImgUint8Array[prevImgIndex + 3];
            }
        }

        const data = Skia.Data.fromBytes(pixels);
        const newImg = Skia.Image.MakeImage(
            {
                width,
                height,
                alphaType: AlphaType.Opaque,
                colorType: ColorType.RGBA_8888,
            },
            data,
            width * 4,
        );

        if (newImg === null) {
            throw new Error();
        }

        return newImg;
    }

    getTemporaryCenter() {
        const skiaData = Skia.Data.fromBytes(this.visualCenterArray);

        const img = Skia.Image.MakeImage(
            {
                width: this.envSetup.getMakeImgParam.width,
                height: this.envSetup.getMakeImgParam.height,
                alphaType: AlphaType.Opaque,
                colorType: ColorType.RGBA_8888,
            },
            skiaData,
            this.envSetup.getMakeImgParam.rowLength,
        );

        if (img === null) {
            throw new Error();
        }

        return img;
    }

    drawCenter({ x, y }: { x: number; y: number }) {
        const { width: realWidth, height: realHeight } = this.envSetup.getRealImgParam;
        const width = realWidth * this.gridManager.getPixelRatio;
        const height = realHeight * this.gridManager.getPixelRatio;

        for (let i = 0; i < width; i++) {
            const startIndex = width * y * 4 + i * 4;
            this.visualCenterArray[startIndex] = 60;
            this.visualCenterArray[startIndex + 1] = 179;
            this.visualCenterArray[startIndex + 2] = 113;
            this.visualCenterArray[startIndex + 3] = 255;
        }

        for (let i = 0; i < height; i++) {
            const startIndex = width * i * 4 + x * 4;
            this.visualCenterArray[startIndex] = 60;
            this.visualCenterArray[startIndex + 1] = 179;
            this.visualCenterArray[startIndex + 2] = 113;
            this.visualCenterArray[startIndex + 3] = 255;
        }
    }
}
