import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { DefaultRowCenterContent } from '@/components/container/defaultBox';

export const Container = styled.View`
    margin-top: ${props => rem(props, 0.8)};
`;

export const VisibleContentContainer = styled.View`
    position: relative;
    z-index: 3;
    height: 100%;
    background: ${props => props.theme.colors.appBg};
`;

interface RealImgContainerProps {
    width: number;
    height: number;
}
export const RealImgContainer = styled.View<RealImgContainerProps>`
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    position: absolute;
    z-index: -1;
`;

export const SetRadiusContainer = styled.View`
    display: flex;
    gap: ${props => rem(props, 1.6)};
    width: 50%;
    height: 35%;
    padding: ${props => rem(props, 1.6)};
    border-radius: 16px;
    justify-content: center;
    background-color: ${props => props.theme.colors.cardBg};
`;

export const SaveButtonContainer = styled(DefaultRowCenterContent)`
    margin-top: ${props => rem(props, 1.6)};
`;
