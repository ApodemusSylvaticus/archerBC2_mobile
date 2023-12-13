import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const RubberSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg
            fill={fillColor}
            width={width}
            height={height}
            viewBox="-1.5 -2.5 24 24"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMinYMin"
            className="jam jam-rubber">
            <Path d="M12.728 12.728L8.485 8.485l-5.657 5.657 2.122 2.121a3 3 0 0 0 4.242 0l3.536-3.535zM11.284 17H14a1 1 0 0 1 0 2H3a1 1 0 0 1-.133-1.991l-1.453-1.453a2 2 0 0 1 0-2.828L12.728 1.414a2 2 0 0 1 2.828 0L19.8 5.657a2 2 0 0 1 0 2.828L11.284 17z" />
        </Svg>
    );
});
