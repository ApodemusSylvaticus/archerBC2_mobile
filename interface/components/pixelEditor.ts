import { SkImage } from '@shopify/react-native-skia';
import { DefaultModalWithBackBtnProps } from '@/components/modals/DefaultModal';

export enum TOOLS {
    PEN,
    RUBBER,
    CIRCLE,
    RECTANGLE,
}
export interface IRect {
    x: number;
    y: number;
    size: number;
    color: string;
}

export interface EditorProps {
    img: SkImage;
    setNewImg: (data: string) => void;
}

export interface PixelEditorModalProps extends DefaultModalWithBackBtnProps {
    image: string;
    setNewImg: (data: string) => void;
}
