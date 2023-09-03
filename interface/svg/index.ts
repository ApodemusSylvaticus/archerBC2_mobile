export interface BaseSVGProps {
    width: number;
    height: number;
    fillColor: string;
}

export interface ArrowSVGProps extends BaseSVGProps {
    onPress: () => void;
    orientation: 'top' | 'bottom' | 'left' | 'right';
}

export interface PureArrowProps extends BaseSVGProps {
    orientation: 'top' | 'bottom' | 'left' | 'right';
}
