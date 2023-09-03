import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.View<{ top: number }>`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    padding-top: ${props => props.top + props.theme.rem * 1.6}px;
`;

export const NameBarContainer = styled.View`
    border-color: ${props => props.theme.colors.activeTab};
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    padding-bottom: ${props => rem(props, 0.4)};
`;

export const LeftCrunch = styled.View`
    height: 80px;
    width: 15px;
    position: absolute;
    left: -1px;
    bottom: 10px;
    z-index: 10;
    background: ${props => props.theme.colors.appBg};
`;

export const RightCrunch = styled.View`
    height: 80px;
    width: 15px;
    position: absolute;
    right: -1px;
    bottom: 10px;
    z-index: 10;

    background: ${props => props.theme.colors.appBg};
`;
