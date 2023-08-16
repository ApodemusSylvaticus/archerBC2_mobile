import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { Link } from 'expo-router';
import { rem } from '@/helpers/rem';
import { getWindowWidth } from '@/helpers/getWindowParam';

interface IContainerProps {
    isActive: boolean;
    additionalSpace: number;
}

export const LinkEl = styled(Link)`
    width: ${getWindowWidth() / 5}px;
`;

export const Container = styled(Pressable)<IContainerProps>`
    padding-top: ${props => rem(props, 0.4)};
    padding-bottom: ${props => props.theme.rem * 0.4 + props.additionalSpace}px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => rem(props, 0.4)};
    background: ${props => (props.isActive ? props.theme.colors.l1ActiveEl : props.theme.colors.cardBg)};
`;

export const MockImg = styled.View`
    width: ${props => rem(props, 2.5)};
    height: ${props => rem(props, 2.5)};
    background: blueviolet;
`;
