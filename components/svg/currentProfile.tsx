import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const CurrentProfileSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 26 25">
            <Path
                fill={fillColor}
                d="M13 0C9.562 0 6.75 3.5 6.75 7.813c0 4.312 2.813 7.812 6.25 7.812 3.438 0 6.25-3.5 6.25-7.813C19.25 3.5 16.437 0 13 0ZM6.469 15.625C3.156 15.781.5 18.5.5 21.875V25h25v-3.125a6.234 6.234 0 0 0-5.969-6.25c-1.687 1.906-4 3.125-6.531 3.125-2.531 0-4.844-1.219-6.531-3.125Z"
            />
        </Svg>
    );
};
