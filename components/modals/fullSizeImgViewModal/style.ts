import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { rem } from '@/helpers/rem';

interface ContainerProps {
    paddingTop: number;
}
export const Container = styled.View<ContainerProps>`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.appBg};
    display: flex;
    padding: ${props => rem(props, 0.8)};
    padding-top: ${props => (Platform.OS === 'web' ? props.paddingTop + props.theme.rem * 1.6 : props.paddingTop)}px;
    gap: ${props => rem(props, 1.6)};
`;

export const Header = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: ${props => rem(props, 1.6)};
`;
