import styled from 'styled-components/native';
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
    display: flex;
    flex-direction: column;
    gap: ${props => rem(props, 1.6)};
`;

export const GoBackButton = styled(DefaultButton)`
    background: ${props => props.theme.colors.l1ActiveEl};
    width: max-content;
    align-self: baseline;
    margin-top: ${props => rem(props, 1.6)};
    margin-left: ${props => rem(props, 0.8)};
`;

export const GoBackButtonText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.secondary};
`;
