import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const InputWrapper = styled.View`
    width: 100%;
    position: relative;
    gap: ${props => rem(props, 0.4)};
`;

interface IInputLabelProps {
    isActive: boolean;
    background: string;
}

export const InputLabel = styled.Text<IInputLabelProps>`
    font-size: ${props => (props.isActive ? rem(props, 1.4) : rem(props, 2))};
    position: absolute;
    left: ${props => (props.isActive ? rem(props, 0.8) : rem(props, 1.2))};
    top: ${props => (props.isActive ? rem(props, -1) : rem(props, 1.3))};
    z-index: ${props => (props.isActive ? 2 : -1)};
    color: ${props => (props.isActive ? props.theme.colors.secondary : props.theme.colors.l1ActiveEl)};
    background: ${props => (props.isActive ? props.background : 'transparent')};
    padding: 0 ${props => rem(props, 0.4)};
`;

export const Input = styled.TextInput`
    padding: ${props => rem(props, 1.2)} ${props => rem(props, 1.6)};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 4px;
    font-size: ${props => rem(props, 2)};
    color: ${props => props.theme.colors.secondary};
`;
export const InputError = styled.Text`
    color: ${props => props.theme.colors.error};
`;
