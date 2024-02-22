import { SkImage } from '@shopify/react-native-skia';
import { DefaultModalWithBackBtnProps } from '@/components/modals/DefaultModal';

export enum TOOLS {
    PEN,
    CIRCLE,
    RECTANGLE,
    LINE,
}

export interface EditorProps {
    img: SkImage;
    setNewImg: (data: string) => void;
}

export interface PixelEditorModalProps extends DefaultModalWithBackBtnProps {
    image: string;
    setNewImg: (base64Str: string) => Promise<void>;
}
