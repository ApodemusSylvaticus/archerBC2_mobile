import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const LineSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg fill={fillColor} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <Path d="M3.293,20.707a1,1,0,0,1,0-1.414l16-16a1,1,0,1,1,1.414,1.414l-16,16A1,1,0,0,1,3.293,20.707Z" />
        </Svg>
    );
});
