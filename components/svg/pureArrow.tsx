import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import Svg, { Path, G, Defs } from 'react-native-svg';
import { PureArrowProps } from '@/interface/svg/arrowSvg';

export const PureArrow: React.FC<PureArrowProps> = ({ size, fillColor, orientation }) => {
    const [transformParam, setTransform] = useState('0 deg');

    useEffect(() => {
        switch (orientation) {
            case 'bottom':
                setTransform('0deg');
                break;
            case 'left':
                setTransform('90deg');
                break;
            case 'right':
                setTransform('270deg');
                break;
            case 'top':
                setTransform('180deg');
                break;
            default:
                setTransform('0deg');
        }
    }, [orientation]);

    return (
        <View style={{ transform: `rotate(${transformParam})` }}>
            <Svg width={size} height={size} viewBox="0 -4.5 20 20" xmlns="http://www.w3.org/2000/svg">
                <Defs />
                <G id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <G id="Dribbble-Light-Preview" transform="translate(-180.000000, -6684.000000)" fill={fillColor}>
                        <G id="icons" transform="translate(56.000000, 160.000000)">
                            <Path
                                d="M144,6525.39 L142.594,6524 L133.987,6532.261 L133.069,6531.38 L133.074,6531.385 L125.427,6524.045 L124,6525.414 C126.113,6527.443 132.014,6533.107 133.987,6535 C135.453,6533.594 134.024,6534.965 144,6525.39"
                                id="arrow_down-[#339]"
                            />
                        </G>
                    </G>
                </G>
            </Svg>
        </View>
    );
};
