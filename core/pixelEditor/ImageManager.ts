import { AlphaType, ColorType, Skia, SkImage } from '@shopify/react-native-skia';
import { EnvSetup } from '@/core/pixelEditor/EnvSetup';
import { GridManager } from '@/core/pixelEditor/GridManager';
import { IHistoryElem, IPixel } from '@/interface/core/pixelEditor';

export class ImageManager {
    private imgUint8Array: Uint8Array;

    private envSetup: EnvSetup;

    private gridManager: GridManager;

    private history: IHistoryElem[][] = [];

    private historyIndex: number = -1;

    setNewImg(img: SkImage) {
        const pixels = img.readPixels();

        if (pixels === null) {
            throw new Error();
        }

        this.historyIndex = -1;
        this.history = [];
        this.imgUint8Array = pixels as Uint8Array;
    }

    get isHistoryAvailable() {
        return { goBack: this.historyIndex > -1, goForward: this.historyIndex < this.history.length - 1 };
    }

    get getImgUint8Array() {
        return this.imgUint8Array;
    }

    goBackHistory(): SkImage {
        const makeImgParam = this.envSetup.getMakeImgParam;
        if (this.history.length === 0) {
            throw new Error('Trying to goBackHistory, but history is empty');
        }

        if (this.historyIndex < 0) {
            throw new Error('Trying to goBackHistory, but historyIndex < 0');
        }

        const prevState = this.history[this.historyIndex];
        prevState.forEach(({ index, prev: { r, g, b } }) => {
            this.imgUint8Array[index] = r;
            this.imgUint8Array[index + 1] = g;
            this.imgUint8Array[index + 2] = b;
        });
        const skiaData = Skia.Data.fromBytes(this.imgUint8Array);

        const img = Skia.Image.MakeImage(
            {
                width: makeImgParam.width,
                height: makeImgParam.height,
                alphaType: AlphaType.Opaque,
                colorType: ColorType.RGBA_8888,
            },
            skiaData,
            makeImgParam.rowLength,
        );

        if (!img) {
            throw new Error();
        }

        this.historyIndex -= 1;
        return img;
    }

    goForwardHistory(): SkImage {
        const makeImgParam = this.envSetup.getMakeImgParam;
        if (this.history.length === 0) {
            throw new Error('Trying to goForwardHistory, but history is empty');
        }
        if (this.historyIndex === this.history.length - 1) {
            throw new Error('Trying to goForwardHistory, but history index === history length - 1');
        }
        this.historyIndex += 1;
        const prevState = this.history[this.historyIndex];
        prevState.forEach(({ index, actual: { r, g, b } }) => {
            this.imgUint8Array[index] = r;
            this.imgUint8Array[index + 1] = g;
            this.imgUint8Array[index + 2] = b;
        });
        const skiaData = Skia.Data.fromBytes(this.imgUint8Array);

        const img = Skia.Image.MakeImage(
            {
                width: makeImgParam.width,
                height: makeImgParam.height,
                alphaType: AlphaType.Opaque,
                colorType: ColorType.RGBA_8888,
            },
            skiaData,
            makeImgParam.rowLength,
        );

        if (!img) {
            throw new Error();
        }

        return img;
    }

    setToHistory(data: IHistoryElem[]) {
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
            this.history.push(data);
            this.historyIndex += 1;
            return;
        }

        this.history.push(data);
        this.historyIndex += 1;
    }

    constructor(baseImg: SkImage, envSetup: EnvSetup, gridManager: GridManager) {
        this.envSetup = envSetup;
        this.gridManager = gridManager;
        const pixelData = baseImg.readPixels();
        if (pixelData === null) {
            throw new Error();
        }
        this.imgUint8Array = pixelData as Uint8Array;
        this.history = [];
    }

    setPixelsToImg(pixelsData: IPixel[]): SkImage {
        const realImgParam = this.envSetup.getRealImgParam;
        const pixelSize = this.gridManager.getPixelSize;
        const makeImgParam = this.envSetup.getMakeImgParam;
        const localHistory: IHistoryElem[] = [];
        const cellsData = pixelsData.map(({ x, y, color }) => {
            if (x >= realImgParam.width || y >= realImgParam.height) {
                return null;
            }

            return {
                cellCountX: Math.round(x / pixelSize),
                cellCountY: Math.round(y / pixelSize),
                color,
            };
        });

        cellsData.forEach(data => {
            if (data === null) {
                return;
            }

            const { cellCountX, cellCountY, color } = data;
            const index = cellCountY * makeImgParam.width * 4 + cellCountX * 4;

            const r = this.imgUint8Array[index];
            const g = this.imgUint8Array[index + 1];
            const b = this.imgUint8Array[index + 2];

            if (color) {
                this.imgUint8Array[index] = color.r;
                this.imgUint8Array[index + 1] = color.g;
                this.imgUint8Array[index + 2] = color.b;
            } else {
                this.imgUint8Array[index] = r === 255 ? 0 : 255;
                this.imgUint8Array[index + 1] = g === 255 ? 0 : 255;
                this.imgUint8Array[index + 2] = b === 255 ? 0 : 255;
            }
            localHistory.push({
                index,
                prev: { r, g, b },
                actual: {
                    r: this.imgUint8Array[index],
                    g: this.imgUint8Array[index + 1],
                    b: this.imgUint8Array[index + 2],
                },
            });
        });

        const skiaData = Skia.Data.fromBytes(this.imgUint8Array);

        const img = Skia.Image.MakeImage(
            {
                width: makeImgParam.width,
                height: makeImgParam.height,
                alphaType: AlphaType.Opaque,
                colorType: ColorType.RGBA_8888,
            },
            skiaData,
            makeImgParam.rowLength,
        );

        if (!img) {
            throw new Error();
        }

        this.setToHistory(localHistory);
        return img;
    }
}
