import React, { useEffect, useState } from 'react';
import Svg, { Path } from 'react-native-svg';
import { Pressable, I18nManager } from 'react-native';
import { ArrowSVGProps } from '@/interface/svg';

export const ArrowSVG: React.FC<ArrowSVGProps> = ({ width, height, fillColor, onPress, orientation }) => {
    const [transformParam, setTransform] = useState('0deg');

    useEffect(() => {
        switch (orientation) {
            case 'bottom':
                setTransform('270deg');
                break;
            case 'left':
                setTransform(I18nManager.isRTL ? '180deg' : '0deg');
                break;
            case 'right':
                setTransform(I18nManager.isRTL ? '0deg' : '180deg');
                break;
            case 'top':
                setTransform('90deg');
                break;
            default:
                setTransform(I18nManager.isRTL ? '180deg' : '0deg');
        }
    }, [orientation]);

    return (
        <Pressable onPress={onPress} style={{ transform: `rotate(${transformParam})` }}>
            <Svg width={width} height={height} viewBox="0 0 259 262" fill="none" xmlns="http://www.w3.org/2000/svg">
                <Path
                    d="M129.583 0.689655C58.2847 0.689655 0.501852 59.0327 0.501852 131C0.501852 202.967 58.2847 261.311 129.583 261.311C200.871 261.311 258.664 202.967 258.664 131C258.664 59.0327 200.871 0.689655 129.583 0.689655ZM129.583 250.886C64.1023 250.886 10.8279 197.104 10.8279 131C10.8279 64.8959 64.1023 11.1141 129.583 11.1141C195.073 11.1141 248.338 64.8959 248.338 131C248.338 197.104 195.073 250.886 129.583 250.886Z"
                    fill={fillColor}
                />
                <Path
                    d="M121.747 74.9743L114.443 67.6007L51.6599 130.992L114.443 194.383L121.747 187.01L71.4261 136.209H196.708V125.785H71.4261L121.747 74.9743Z"
                    fill={fillColor}
                />
            </Svg>
        </Pressable>
    );
};
