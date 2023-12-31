import React from 'react';
import { Pressable } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import { PressableSVGProps } from '@/interface/svg';

export const ChainSVG: React.FC<PressableSVGProps> = ({ width, height, fillColor, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Svg width={width} height={height} viewBox="0 0 64 64" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                <G>
                    <G>
                        <Path
                            d="M35.521,41.288c-3.422,0-6.64-1.333-9.06-3.753c-1.106-1.106-1.106-2.9,0-4.006    c1.106-1.106,2.9-1.106,4.006,0c1.35,1.35,3.145,2.093,5.054,2.093c1.909,0,3.704-0.743,5.054-2.094l7.538-7.538    c2.787-2.787,2.787-7.321,0-10.108c-2.787-2.787-7.321-2.787-10.108,0l-3.227,3.227c-1.106,1.106-2.9,1.106-4.006,0    c-1.106-1.106-1.106-2.9,0-4.006L34,11.877c4.996-4.996,13.124-4.995,18.12,0c4.996,4.996,4.996,13.124,0,18.12l-7.538,7.538    C42.161,39.955,38.944,41.288,35.521,41.288z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M20.94,55.869c-3.422,0-6.64-1.333-9.06-3.753c-4.996-4.996-4.996-13.124,0-18.12l7.538-7.538    c4.996-4.995,13.124-4.995,18.12,0c1.106,1.106,1.106,2.9,0,4.006c-1.106,1.106-2.9,1.106-4.006,0    c-2.787-2.787-7.321-2.787-10.108,0l-7.538,7.538c-2.787,2.787-2.787,7.321,0,10.108c1.35,1.35,3.145,2.094,5.054,2.094    c1.909,0,3.704-0.743,5.054-2.093l3.227-3.227c1.106-1.106,2.9-1.106,4.006,0c1.106,1.106,1.106,2.9,0,4.006L30,52.117    C27.58,54.536,24.363,55.869,20.94,55.869z"
                            fill={fillColor}
                        />
                    </G>
                </G>
            </Svg>
        </Pressable>
    );
};

export const ChainBrokenChainSVG: React.FC<PressableSVGProps> = ({ width, height, fillColor, onPress }) => {
    return (
        <Pressable onPress={onPress}>
            <Svg width={width} height={height} viewBox="0 0 64 64" id="Layer_1" xmlns="http://www.w3.org/2000/svg">
                <G>
                    <G>
                        <Path
                            d="M43.124,38.264c-0.712,0-1.424-0.272-1.967-0.815c-1.086-1.086-1.086-2.847,0-3.934l7.403-7.403    c2.737-2.737,2.737-7.19,0-9.927c-2.737-2.737-7.19-2.737-9.927,0l-3.169,3.169c-1.086,1.086-2.847,1.086-3.934,0    c-1.086-1.086-1.086-2.847,0-3.934l3.169-3.169c2.377-2.376,5.536-3.685,8.897-3.685c3.361,0,6.52,1.309,8.897,3.685    c4.906,4.906,4.906,12.888,0,17.794l-7.403,7.403C44.548,37.993,43.836,38.264,43.124,38.264z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M21.875,55.454c-3.361,0-6.52-1.309-8.897-3.685c-2.376-2.376-3.685-5.536-3.685-8.897    c0-3.361,1.309-6.521,3.685-8.897l7.403-7.403c1.086-1.086,2.847-1.086,3.934,0c1.086,1.086,1.086,2.847,0,3.934l-7.403,7.403    c-2.737,2.737-2.737,7.19,0,9.927c1.326,1.326,3.088,2.056,4.963,2.056c1.875,0,3.637-0.73,4.963-2.056l3.169-3.169    c1.086-1.086,2.847-1.086,3.934,0c1.086,1.086,1.086,2.847,0,3.934l-3.169,3.169C28.396,54.145,25.236,55.454,21.875,55.454z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M34.763,36.384l12.64,12.953c1.081,1.108,1.06,2.883-0.048,3.964    c-1.108,1.081-2.883,1.06-3.964-0.048c-0.163-0.167-0.308-0.362-0.421-0.555l-9.054-15.67c-0.148-0.256-0.06-0.584,0.196-0.733    C34.328,36.169,34.596,36.213,34.763,36.384z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M43.682,40.592l11.855,3.295c1.505,0.418,2.387,1.978,1.968,3.483    c-0.418,1.505-1.978,2.387-3.483,1.968c-0.342-0.095-0.66-0.256-0.929-0.455l-9.878-7.336c-0.24-0.178-0.29-0.517-0.112-0.757    C43.239,40.607,43.473,40.535,43.682,40.592z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M21.797,22.727L8.434,18.895c-1.496-0.429-2.362-1.99-1.933-3.486    c0.429-1.496,1.99-2.362,3.486-1.933c0.299,0.086,0.582,0.224,0.825,0.39l11.44,7.898c0.245,0.169,0.307,0.505,0.137,0.75    C22.255,22.71,22.013,22.788,21.797,22.727z"
                            fill={fillColor}
                        />
                    </G>

                    <G>
                        <Path
                            d="M29.005,25.121l-9.668-11.999c-0.974-1.209-0.784-2.979,0.425-3.953    c1.209-0.974,2.979-0.784,3.953,0.425c0.174,0.216,0.316,0.463,0.416,0.708l5.791,14.28c0.112,0.275-0.021,0.589-0.296,0.701    C29.401,25.373,29.151,25.301,29.005,25.121z"
                            fill={fillColor}
                        />
                    </G>
                </G>
            </Svg>
        </Pressable>
    );
};
