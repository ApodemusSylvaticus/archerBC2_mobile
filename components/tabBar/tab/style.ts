import styled from 'styled-components/native';
import { Pressable } from 'react-native';
import { Link } from 'expo-router';
import { rem } from '@/helpers/rem';
import { getWindowWidth } from '@/helpers/getWindowParam';
import { IsActive } from '@/interface/components/defaultStyleProps';

interface IContainerProps extends IsActive {
    additionalSpace: number;
}

export const LinkEl = styled(Link)`
    width: ${getWindowWidth() / 5}px;
`;

export const Container = styled(Pressable)<IContainerProps>`
    padding-top: ${props => rem(props, 0.8)};
    padding-bottom: ${props => props.theme.rem * 0.8 + props.additionalSpace}px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    background: ${props => (props.isActive ? props.theme.colors.l1ActiveEl : props.theme.colors.cardBg)};
`;
