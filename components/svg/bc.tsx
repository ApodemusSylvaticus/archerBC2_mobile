import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { BaseSVGProps } from '@/interface/svg';

export const BcSVG: React.FC<BaseSVGProps> = ({ width, height, fillColor }) => {
    return (
        <Svg width={width} height={height} viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
            <Path
                d="M296 137.832C296 211.739 235.975 271.665 161.916 271.665C87.8562 271.665 27.8315 211.739 27.8315 137.832C27.8315 63.9256 87.8562 4 161.916 4C235.975 4 296 63.9256 296 137.832Z"
                stroke={fillColor}
                strokeWidth="8"
            />
            <Path
                d="M261.058 137.832C261.058 192.557 216.612 236.93 161.774 236.93C106.935 236.93 62.4893 192.557 62.4893 137.832C62.4893 83.1072 106.935 38.7344 161.774 38.7344C216.612 38.7344 261.058 83.1072 261.058 137.832Z"
                stroke={fillColor}
                strokeWidth="6"
            />
            <Path d="M287.786 137.985H191.468" stroke={fillColor} strokeWidth="5" strokeLinecap="round" />
            <Path d="M132.191 137.832H35.8726" stroke={fillColor} strokeWidth="5" strokeLinecap="round" />
            <Path d="M161.774 97.9761L161.774 12.168" stroke={fillColor} strokeWidth="5" strokeLinecap="round" />
            <Path d="M161.774 263.497L161.774 177.689" stroke={fillColor} strokeWidth="5" strokeLinecap="round" />
            <Path d="M172.002 144.696L161.782 131.721" stroke={fillColor} strokeWidth="4" />
            <Path d="M151.545 144.682L161.765 131.706" stroke={fillColor} strokeWidth="4" />
            <Path d="M172.002 130.686H151.546" stroke={fillColor} strokeWidth="4" strokeLinecap="round" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M115.63 190.434V163.043H16.5186V190.434H115.63ZM115.63 204.13H16.5186V286.304H115.63V204.13ZM82.5929 245.217V238.369H99.1115V245.217V272.609H82.5929V245.217ZM16.5186 149.347H115.63C124.753 149.347 132.149 155.479 132.149 163.043V286.304C132.149 293.868 124.753 300 115.63 300H16.5186C7.39562 300 0 293.868 0 286.304V163.043C0 155.479 7.39562 149.347 16.5186 149.347ZM49.5558 272.609H33.0372V258.913H49.5558V272.609ZM74.3337 272.609H57.8151V258.913H74.3337V272.609ZM49.5558 252.065H33.0372V238.369H49.5558V252.065ZM74.3337 252.065H57.8151V238.369H74.3337V252.065ZM49.5558 231.521H33.0372V217.826H49.5558V231.521ZM74.3337 231.521H57.8151V217.826H74.3337V231.521ZM99.1115 231.521H82.5929V217.826H99.1115V231.521Z"
                fill={fillColor}
            />
        </Svg>
    );
};
