import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const ReticlesSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 26 25">
            <Path
                fill={fillColor}
                d="M6.75 6.25a8.836 8.836 0 0 0 0 12.5 8.836 8.836 0 0 0 12.5 0 8.836 8.836 0 0 0 0-12.5 8.836 8.836 0 0 0-12.5 0Zm.438 5.125h4.687V6.687h2.25v4.688h4.688v2.25h-4.688v4.688h-2.25v-4.688H7.187v-2.25Z"
            />
        </Svg>
    );
};
