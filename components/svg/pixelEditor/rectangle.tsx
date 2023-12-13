import React from 'react';
import Svg, { Rect } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const RectangleSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Rect
                x="3"
                y="5"
                width="18"
                height="14"
                rx="2"
                stroke={fillColor}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
});
