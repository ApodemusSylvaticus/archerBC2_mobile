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

interface CenterImgContainerProps {
    width: number;
    height: number;
}
export const CenterImgContainer = styled.View<CenterImgContainerProps>`
    position: absolute;
    top: 0;
    left: 0;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    z-index: 3;
`;

export const SetRadiusContainer = styled.View`
    display: flex;
    gap: ${props => rem(props, 1.6)};
    width: 85%;
    padding: ${props => rem(props, 3.2)} ${props => rem(props, 1)};
    border-radius: 16px;
    justify-content: center;
    background-color: ${props => props.theme.colors.cardBg};
`;

export const SaveButtonContainer = styled(DefaultRowCenterContent)`
    margin-top: ${props => rem(props, 1.6)};
`;
