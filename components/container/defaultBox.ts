import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { rem } from '@/helpers/rem';
import { getWindowHeight } from '@/helpers/getWindowParam';

interface DefaultAppContainerProps {
    right: number;
    left: number;
}
export const DefaultAppContainer = styled.View<DefaultAppContainerProps>`
    position: relative;
    min-height: ${getWindowHeight()}px;
    padding-top: ${props => (Platform.OS === 'web' ? rem(props, 15) : rem(props, 0.8))};
    padding-left: ${props => props.left + props.theme.rem * 0.8}px;
    padding-right: ${props => props.right + props.theme.rem * 0.8}px;
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
    border-radius: 16px;
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

export const DefaultRowFlex1 = styled(DefaultRow)`
    flex: 1;
`;

export const SeparateRow = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${props => rem(props, 0.8)};
`;
