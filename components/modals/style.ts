import styled from 'styled-components/native';
import { Platform } from 'react-native';
import { rem } from '@/helpers/rem';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';

export const Container = styled.View`
    width: 100%;
    height: 100%;
    background: ${props => props.theme.colors.appBg};
    display: flex;
`;

export const ContentContainer = styled.View`
    width: 100%;
    height: 100%;
    padding: ${props => rem(props, 1.6)} ${props => rem(props, 0.8)};
    gap: ${props => rem(props, 1.6)};
    display: flex;
    flex-direction: column;
`;

export const GoBackButton = styled(DefaultButton)`
    padding: ${props => rem(props, 0.4)} ${props => rem(props, 2.4)};

    background: ${props => props.theme.colors.l1ActiveEl};
`;

export const GoBackButtonText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.primary};
`;

interface HeaderProps {
    topM: number;
}
export const HeaderModalBase = styled.View<HeaderProps>`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    // padding-top: ${props => (Platform.OS === 'web' ? props.topM + props.theme.rem * 1.6 : props.topM)}px;

    padding-top: ${props => (Platform.OS === 'android' ? props.topM / 2 : props.topM)}px;

    padding-left: ${props => rem(props, 0.8)};
    padding-right: ${props => rem(props, 0.8)};
    padding-bottom: ${props => rem(props, 1.6)};
`;
