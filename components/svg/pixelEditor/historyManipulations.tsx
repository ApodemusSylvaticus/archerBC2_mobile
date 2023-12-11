import React from 'react';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const GoBackSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg
            fill={fillColor}
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 299.021 299.021">
            <G>
                <G>
                    <Path
                        d="M292.866,254.432c-2.288,0-4.443-1.285-5.5-3.399c-0.354-0.684-28.541-52.949-146.169-54.727v51.977
			c0,2.342-1.333,4.48-3.432,5.513c-2.096,1.033-4.594,0.793-6.461-0.63L2.417,154.392C0.898,153.227,0,151.425,0,149.516
			c0-1.919,0.898-3.72,2.417-4.888l128.893-98.77c1.87-1.426,4.365-1.667,6.461-0.639c2.099,1.026,3.432,3.173,3.432,5.509v54.776
			c3.111-0.198,7.164-0.37,11.947-0.37c43.861,0,145.871,13.952,145.871,143.136c0,2.858-1.964,5.344-4.75,5.993
			C293.802,254.384,293.34,254.432,292.866,254.432z"
                    />
                </G>
            </G>
        </Svg>
    );
});

export const GoForwardSvg: React.FC<BaseSVGProps> = React.memo(({ width, height, fillColor }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <G clip-path="url(#clip0_265_195)">
                <Path
                    d="M4.11677 170.177C5.6471 170.177 7.08847 169.317 7.79544 167.903C8.03221 167.446 26.8851 132.488 105.56 131.299V166.064C105.56 167.63 106.452 169.06 107.856 169.751C109.258 170.442 110.929 170.282 112.177 169.33L198.383 103.265C199.399 102.486 200 101.281 200 100.004C200 98.7203 199.399 97.5157 198.383 96.7345L112.173 30.6722C110.923 29.7184 109.254 29.5572 107.852 30.2448C106.448 30.931 105.556 32.3671 105.556 33.9295V70.5664C103.476 70.434 100.765 70.3189 97.5657 70.3189C68.2293 70.3189 1.41881e-06 79.6507 1.41881e-06 166.055C1.41881e-06 167.967 1.31362 169.63 3.17704 170.064C3.49073 170.145 3.79973 170.177 4.11677 170.177Z"
                    fill={fillColor}
                />
            </G>
            <Defs>
                <ClipPath id="clip0_265_195">
                    <Rect width={width} height={height} fill="white" transform="matrix(-1 0 0 1 200 0)" />
                </ClipPath>
            </Defs>
        </Svg>
    );
});
