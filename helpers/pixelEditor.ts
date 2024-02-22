import { PixelRatio } from 'react-native';
import { IPixel } from '@/interface/core/pixelEditor';

export const closestLeftThird = (value: number): number => {
    const pixelRatio = PixelRatio.get();
    const integerPart = Math.floor(value);
    const decimalPart = value - integerPart;

    for (let i = pixelRatio - 1; i > 0; i -= 1) {
        if (decimalPart > i / pixelRatio) {
            return integerPart + i / pixelRatio;
        }
    }

    return integerPart;
};
export const removeDuplicatesFromPixels = (pixels: IPixel[]) => {
    const uniquePixels: IPixel[] = [];
    const seen = new Set();

    pixels.forEach(pixel => {
        // Create a unique string identifier for each pixel based on its coordinates
        const identifier = `${pixel.x}:${pixel.y}`;
        if (!seen.has(identifier)) {
            uniquePixels.push(pixel);
            seen.add(identifier);
        }
    });

    return uniquePixels;
};
