import { SkImage } from '@shopify/react-native-skia';
import { PixelRatio } from 'react-native';
import { getWindowWidth } from '@/helpers/getWindowParam';

export interface IMakeImgParam {
    width: number;
    height: number;
    rowLength: number;
}

export class EnvSetup {
    private readonly contentContainer;

    private readonly realImgParam;

    private makeImgParam: IMakeImgParam;

    get getContentContainer() {
        return this.contentContainer;
    }

    get getRealImgParam() {
        return this.realImgParam;
    }

    get getMakeImgParam() {
        return this.makeImgParam;
    }

    constructor(baseImg: SkImage) {
        const pixelRatio = PixelRatio.get();

        const windowWidth = getWindowWidth();
        this.contentContainer = {
            width: windowWidth,
            height: (windowWidth * 3) / 4,
        };

        const width = baseImg.width();
        const height = baseImg.height();
        this.realImgParam = { width: baseImg.width() / pixelRatio, height: baseImg.height() / pixelRatio };

        this.makeImgParam = {
            width,
            height,
            rowLength: width * 4,
        };
    }
}
