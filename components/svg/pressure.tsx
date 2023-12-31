import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const PressureSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill={fillColor}>
            <Path d="M14,19V17.73a8,8,0,1,0-4,0V19H2v3H22V19ZM6.12,11.17A5.9,5.9,0,0,1,6.46,7.7a6,6,0,1,1,7.84,7.84,5.9,5.9,0,0,1-3.47.34,6,6,0,0,1-4.71-4.71ZM11,14.05A1.41,1.41,0,0,1,10.5,13c.17-1.9,1.5-7.5,1.5-7.5s1.33,5.6,1.5,7.5a1.39,1.39,0,0,1-.45,1.05h0l0,0A1.45,1.45,0,0,1,11,14.05ZM7,10H8v1H7Zm9,0h1v1H16Zm0-2H15V7h1ZM8,7H9V8H8Zm3-1H10V5h1Zm3,0H13V5h1Z" />
            <Rect width="24" height="24" fill="none" />
        </Svg>
    );
};
