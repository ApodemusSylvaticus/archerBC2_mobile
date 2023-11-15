import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { DefaultButton } from '@/components/button/style';
import { IsActive, IsDisabled } from '@/interface/components/defaultStyleProps';
import { TextSemiBold18 } from '@/components/text/styled';

export const Container = styled.TouchableOpacity<IsDisabled & IsActive>`
    display: flex;
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
    border-radius: ${props => (props.isActive ? 0 : '16px')};
    border: 2px solid ${props => (props.isDisabled ? props.theme.colors.activeTab : props.theme.colors.cardBg)};
    opacity: ${props => (props.isActive ? 0.9 : 1)};

    margin-bottom: ${props => rem(props, 1.6)};
    gap: ${props => rem(props, 0.8)};
`;

export const ActiveOnDeviceLabel = styled(TextSemiBold18)`
    color: ${props => props.theme.colors.success};
`;

export const DisabledText = styled(TextSemiBold18)`
    color: ${props => props.theme.colors.cardBg};
`;

export const Button = styled(DefaultButton)`
    margin-left: auto;
`;
