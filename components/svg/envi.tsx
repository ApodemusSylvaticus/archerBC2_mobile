import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const EnviSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 34 25">
            <Path
                fill={fillColor}
                d="M19.084 0C14.042 0 9.625 3.583 8.667 8.333c-4.583 0-8.334 3.75-8.334 8.334C.333 21.25 4.083 25 8.667 25h18.75a6.242 6.242 0 0 0 6.25-6.25c0-2.708-1.75-5.375-4.167-6.25v-2.083C29.5 4.667 24.834 0 19.084 0Z"
            />
        </Svg>
    );
};
