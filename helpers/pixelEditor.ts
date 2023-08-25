import { Nullable } from '@/interface/helper';
import { getWindowHeight, getWindowWidth } from '@/helpers/getWindowParam';

export interface Pixel {
    x: number;
    y: number;
    r: number;
    g: number;
    b: number;
}

// TODO ADD SETER GETTER
export class PixelEditor {
    OxShift = 0;

    OyShift = 0;

    rowCount = 0;

    columnCount = 0;

    cellSize = 0;

    fillColor = 'red';

    canvas: Nullable<HTMLCanvasElement> = null;

    visibleHeight: number = 0;

    visibleWidth: number = 0;

    scale = 1;

    pixelsData: Pixel[] = [];

    scaleRuler: number[] = [];

    realSizeCoefficient = {
        x: 1,
        y: 1,
    };

    constructor(canvas: HTMLCanvasElement, elemHeight: number, elemWidth: number) {
        const newPixelData: Pixel[] = [];
        this.visibleHeight = getWindowHeight();
        this.visibleWidth = getWindowWidth();

        const ctx = canvas.getContext('2d');
        if (ctx === null) {
            throw new Error('TODO ERROR');
        }
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = '#000000';

        this.canvas = canvas;
        this.canvas.width = 1600;
        this.canvas.height = this.visibleHeight;

        this.realSizeCoefficient = {
            x: this.canvas.width / elemWidth,
            y: this.canvas.height / elemHeight,
        };

        for (let y = 0; y < this.canvas.height; y++) {
            for (let x = 0; x < this.canvas.width; x++) {
                newPixelData.push({ x, y, r: 255, g: 255, b: 255 });
            }
        }
        this.pixelsData = newPixelData;
    }

    updateOyShift = (shift: number) => {
        if (this.scale <= 1) {
            return;
        }
        const max = Math.round(this.visibleHeight * ((this.scale - 1) / this.scale));
        const realShift = Math.round(shift / this.scale);
        this.OyShift = Math.max(0, Math.min(this.OyShift + realShift, max));
    };

    updateOxShift = (shift: number) => {
        if (this.scale <= 1) {
            return;
        }
        const max = Math.round(this.visibleWidth * ((this.scale - 1) / this.scale));
        const realShift = Math.round(shift / this.scale);

        this.OxShift = Math.max(0, Math.min(this.OxShift + realShift, max));
    };

    setScale = (scale: number) => {
        this.scale = scale;
        this.redrawCanvas();
    };

    setPixelData = (data: Pixel[]) => {
        if (this.canvas === null) {
            throw new Error('TODO ERRO');
        }
        data.forEach(el => {
            this.pixelsData[el.y * this.canvas!.width + el.x] = el;
        });
        this.redrawCanvas();
    };

    setFile = (file: File) => {
        const { canvas, pixelsData } = this;
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const img = new Image();
            if (canvas === null) {
                throw new Error('TODO ERROR');
            }
            canvas.width = Math.max(img.width, canvas.width);
            canvas.height = Math.max(img.height, canvas.height);

            img.onload = () => {
                const ctx = canvas.getContext('2d');

                ctx!.drawImage(img, 0, 0);
                const imageData = ctx!.getImageData(0, 0, img.width, img.height);
                for (let y = 0; y < img.height; y++) {
                    for (let x = 0; x < img.width; x++) {
                        const index = (y * img.width + x) * 4;
                        const r = imageData.data[index];
                        const g = imageData.data[index + 1];
                        const b = imageData.data[index + 2];
                        pixelsData[y * canvas!.width + x] = {
                            x,
                            y,
                            r,
                            g,
                            b,
                        };
                    }
                }
            };

            img.onerror = () => {
                console.error('Error loading image');
                // Дополнительная обработка ошибки, если необходимо
            };
        };
        fileReader.readAsDataURL(file);
    };

    paint = (clientX: number, clientY: number) => {
        const { cellSize, scale, pixelsData, canvas, realSizeCoefficient } = this;

        if (canvas === null) {
            throw new Error('TODO EROOR');
        }
        const ctx = canvas.getContext('2d');

        if (ctx === null) {
            throw new Error('TODO EROOR');
        }

        const canvasBoundingRect = canvas.getBoundingClientRect();

        const x = clientX * realSizeCoefficient.x - canvasBoundingRect.left;
        const y = clientY * realSizeCoefficient.y - canvasBoundingRect.top;

        const cellX = Math.floor(x / cellSize);
        const cellY = Math.floor(y / cellSize);

        const roundCellSize = Math.round(cellSize);

        const startX = Math.round(cellX * cellSize);
        const startY = Math.round(cellY * cellSize);

        const roundedRealCellSize = scale === 1 ? roundCellSize : Math.round(roundCellSize / scale);

        // TODO: optimizade
        for (let i = 0; i < roundedRealCellSize; i++) {
            for (let j = 0; j < roundedRealCellSize; j++) {
                const currX = Math.round(startX / scale) + this.OxShift + j;
                const currY = Math.round(startY / scale) + this.OyShift + i;
                const pixel = pixelsData[currY * canvas.width + currX];
                if (pixel) {
                    pixel.r = 0;
                    pixel.g = 0;
                    pixel.b = 0;
                } else {
                    throw new Error();
                }
            }
        }

        ctx.fillRect(startX, startY, roundCellSize, roundCellSize);
    };

    redrawCanvas = () => {
        const { canvas, scale, pixelsData, OxShift, OyShift } = this;
        if (canvas === null) {
            throw new Error('TODO ERROR');
        }
        const ctx = canvas.getContext('2d');

        if (ctx === null) {
            throw new Error('TODO EROOR');
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const visibleX = Math.round(canvas.width / scale);
        const visibleY = Math.round(canvas.height / scale);
        for (let y = OyShift; y < visibleY + OyShift; y++) {
            for (let x = OxShift; x < visibleX + OxShift; x++) {
                const pixel = pixelsData[y * canvas!.width + x];
                if (pixel.r === 255 && pixel.b === 255 && pixel.g === 255) {
                    continue;
                }
                ctx.fillStyle = `rgb(${pixel.r},${pixel.g},${pixel.b})`;
                ctx.imageSmoothingEnabled = false;
                // TODO fix
                ctx.fillRect((x - OxShift) * scale, (y - OyShift) * scale, Math.round(scale), Math.round(scale));
            }
        }
    };

    setColumnCount = (count: number) => {
        if (this.canvas === null) {
            throw new Error('TODO ERROR');
        }

        const cellSize = this.canvas.width / count;
        const rowCount = Math.floor(this.canvas.height / cellSize);
        this.cellSize = cellSize;
        this.columnCount = count;
        this.rowCount = rowCount;
        // scale x2
        for (let i = 1; this.canvas.width / (count * i) > 1; i *= 2) {
            this.scaleRuler.unshift(this.canvas.width / (count * i));
        }
        this.scaleRuler.unshift(1);
        // By 1 px
        /*      for (let i = count; i <= this.canvas.width; i += count) {
            this.scaleRuler.unshift(Number((this.canvas.width / i).toFixed(3)));
        } */
        this.setScale(this.scaleRuler[0]);
    };

    scaleDown = () => {
        const { scale, scaleRuler, redrawCanvas } = this;
        const index = scaleRuler.findIndex(el => el === scale);
        if (index > 0) {
            this.scale = scaleRuler[index - 1];
            redrawCanvas();
        }
    };

    scaleUp = () => {
        const { scale, scaleRuler, redrawCanvas } = this;
        const index = scaleRuler.findIndex(el => el === scale);
        if (index < scaleRuler.length - 1) {
            this.scale = scaleRuler[index + 1];
            redrawCanvas();
        }
    };
}
