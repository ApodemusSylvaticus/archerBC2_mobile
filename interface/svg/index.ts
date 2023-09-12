export interface BaseSVGProps {
    width: number | string;
    height: number | string;
    fillColor: string;
}

export interface PressableSVGProps extends BaseSVGProps {
    onPress?: () => void;
}

export interface ArrowSVGProps extends BaseSVGProps, PressableSVGProps {
    orientation: 'top' | 'bottom' | 'left' | 'right';
}
