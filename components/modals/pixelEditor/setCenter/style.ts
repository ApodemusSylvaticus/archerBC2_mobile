import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.appBg};
    display: flex;
    align-items: center;
    gap: ${props => rem(props, 0.8)};
`;

export const CrossContainer = styled.View`
    position: absolute;
`;

interface CrossProps {
    pixelRatio: number;
    containerHeight: number;
    containerWidth: number;
}
export const VerticalLine = styled.View<CrossProps>`
    width: ${props => 1 / props.pixelRatio}px;
    height: ${props => props.containerHeight}px;
    left: ${props => props.containerWidth / 2}px;
    background: rgba(255, 120, 120, 0.73);
`;

export const HorizontalLine = styled.View<CrossProps>`
    width: ${props => props.containerWidth}px;
    height: ${props => 1 / props.pixelRatio}px;
    bottom: ${props => props.containerHeight / 2}px;
    background: rgba(255, 120, 120, 0.73);
`;

export const ControlPadContainer = styled.View`
    display: flex;
    align-items: center;
    width: 200px;
    gap: 32px;
`;
