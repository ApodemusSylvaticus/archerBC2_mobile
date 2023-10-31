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
    margin-top: ${props => rem(props, 1.6)};
    padding: ${props => rem(props, 1.6)} ${props => rem(props, 0.8)};
    gap: ${props => rem(props, 1.6)};
    display: flex;
    flex-direction: column;
`;

interface GoBackButtonProps {
    topM: number;
}
export const GoBackButton = styled(DefaultButton)<GoBackButtonProps>`
    background: ${props => props.theme.colors.l1ActiveEl};
    width: max-content;
    align-self: baseline;
    margin-top: ${props => (Platform.OS === 'web' ? props.topM + props.theme.rem * 1.6 : props.topM)}px;
    margin-left: ${props => rem(props, 0.8)};
`;

export const GoBackButtonText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.primary};
`;
