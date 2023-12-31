import React from 'react';
import Svg, { G, Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const CircleSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 71.11 71.11" xmlns="http://www.w3.org/2000/svg">
            <G id="Group_36" data-name="Group 36" transform="translate(-82.218 -919.107)">
                <Path
                    id="Path_16"
                    data-name="Path 16"
                    d="M117.773,990.216a35.555,35.555,0,1,1,35.555-35.554A35.6,35.6,0,0,1,117.773,990.216Zm0-68.109a32.555,32.555,0,1,0,32.555,32.555A32.592,32.592,0,0,0,117.773,922.107Z"
                    fill={fillColor}
                />
            </G>
        </Svg>
    );
});
