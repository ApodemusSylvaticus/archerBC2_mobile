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

export const ButtonsContainer = styled.View`
    display: flex;
    flex-direction: row;
    gap: ${props => rem(props, 1.6)};
    margin-top: ${props => rem(props, 1.6)};
    padding-right: ${props => rem(props, 0.8)};
    padding-left: ${props => rem(props, 0.8)};
`;
