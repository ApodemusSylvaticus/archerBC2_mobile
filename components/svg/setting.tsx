import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const SettingSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 26 25">
            <Path
                fill={fillColor}
                d="M11.441 0 9.883 3.71c-.312.093-.592.249-.873.405L5.3 2.556 3.057 4.801 4.615 8.51c-.156.312-.28.561-.406.873L.5 10.94v3.118l3.71 1.558c.124.312.249.561.405.873L3.056 20.2l2.245 2.244 3.709-1.559c.28.125.561.28.873.405L11.44 25h3.118l1.558-3.71c.28-.124.592-.249.873-.405l3.71 1.559 2.244-2.244-1.559-3.71c.125-.28.28-.592.405-.873l3.71-1.558V10.94l-3.71-1.558a5.47 5.47 0 0 0-.405-.873l1.559-3.71L20.7 2.557l-3.71 1.559c-.28-.125-.592-.28-.873-.406L14.56 0h-3.12ZM13 7.793a4.67 4.67 0 0 1 4.676 4.676A4.67 4.67 0 0 1 13 17.145a4.67 4.67 0 0 1-4.676-4.676A4.67 4.67 0 0 1 13 7.793Z"
            />
        </Svg>
    );
};
