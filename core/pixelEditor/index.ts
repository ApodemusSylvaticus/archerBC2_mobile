import { SkImage } from '@shopify/react-native-skia';
import { ImageManager } from './ImageManager';
import { DrawingManager } from './DrawingManager';
import { GestureManager } from './GestureManager';
import { GridManager } from './GridManager';
import { EnvSetup } from '@/core/pixelEditor/EnvSetup';
import { CenterManager } from '@/core/pixelEditor/CenterManager';

export class PixelEditorCore {
    readonly imageManager: ImageManager;

    readonly drawingManager: DrawingManager;

    readonly gestureManager: GestureManager;

    readonly envSetup: EnvSetup;

    readonly gridManager: GridManager;

    readonly centerManager: CenterManager;

    constructor(baseImg: SkImage) {
        this.envSetup = new EnvSetup(baseImg);
        this.gridManager = new GridManager(baseImg.width(), this.envSetup);
        this.imageManager = new ImageManager(baseImg, this.envSetup, this.gridManager);
        this.gestureManager = new GestureManager(this.gridManager, this.envSetup);
        this.drawingManager = new DrawingManager(this.imageManager, this.gridManager, this.gestureManager);
        this.centerManager = new CenterManager(this.envSetup, this.gestureManager, this.imageManager, this.gridManager);
    }
}
