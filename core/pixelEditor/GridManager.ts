import { PixelRatio } from 'react-native';
import { EnvSetup } from '@/core/pixelEditor/EnvSetup';

export class GridManager {
    private readonly gridParam;

    private readonly pixelSize;

    private envSetup: EnvSetup;

    private readonly pixelRatio;

    private gridLineParam: { width: number; height: number; isVisible: boolean }[] = [];

    private cellSizeLine: number[] = [];

    private closestDivisor: number;

    get getGridLineParam() {
        return this.gridLineParam;
    }

    get getCellSizeLine() {
        return this.cellSizeLine;
    }

    get getClosestDivisor() {
        return this.closestDivisor;
    }

    get getGridParam() {
        return this.gridParam;
    }

    get getPixelSize() {
        return this.pixelSize;
    }

    get getPixelRatio() {
        return this.pixelRatio;
    }

    constructor(width: number, envSetup: EnvSetup) {
        this.pixelRatio = PixelRatio.get();
        this.pixelSize = 1 / this.pixelRatio;
        this.gridParam = { gridWidth: 16, gridHeight: 12 };
        this.envSetup = envSetup;

        this.closestDivisor = width / this.gridParam.gridWidth;

        this.setupScaleLine();
    }

    setupScaleLine() {
        const cellSize = this.envSetup.getContentContainer.width / this.gridParam.gridWidth;

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
            { width: this.gridParam.gridWidth * 4, height: this.gridParam.gridHeight * 4, isVisible: true },
            { width: this.gridParam.gridWidth * 2, height: this.gridParam.gridHeight * 2, isVisible: true },
            { width: this.gridParam.gridWidth, height: this.gridParam.gridHeight, isVisible: true },
            { width: this.gridParam.gridWidth / 2, height: this.gridParam.gridHeight / 2, isVisible: true },
        ];
    }
}
