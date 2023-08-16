import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { getWindowHeight } from '@/helpers/getWindowParam';

interface DefaultAppContainerProps {
    right: number;
    left: number;
    top: number;
}
export const DefaultAppContainer = styled.View<DefaultAppContainerProps>`
    min-height: ${getWindowHeight}px;
    padding-top: ${props => props.top}px;
    padding-left: ${props => props.left + props.theme.rem * 1.6}px;
    padding-right: ${props => props.right + props.theme.rem * 1.6}px;
    padding-bottom: ${props => rem(props, 8)};
    background: ${props => props.theme.colors.appBg};
`;

export const DefaultColumnContainer = styled.View`
    display: flex;
    flex-direction: column;
    gap: ${props => rem(props, 1.6)};
`;

export const DefaultBox = styled.View`
    display: flex;
    width: 100%;
    padding: ${props => rem(props, 0.8)};
`;

export const DefaultCard = styled(DefaultBox)`
    flex-direction: column;
    border-radius: 4px;
    gap: ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
`;

export const DefaultRow = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: ${props => rem(props, 0.8)};
`;

export const SeparateRow = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
