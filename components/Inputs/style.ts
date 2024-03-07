import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { TextBold16, TextSemiBold16 } from '@/components/text/styled';
import { IsActive } from '@/interface/components/defaultStyleProps';

export const Container = styled.View`
    display: flex;
    width: 100%;
    flex: 1;
    gap: ${props => rem(props, 0.4)};
`;

interface IsDisabled {
    isDisabled: boolean;
}

export const InputWrapper = styled.View<IsDisabled>`
    flex-grow: 1;
    position: relative;
    border: 1px solid ${props => (props.isDisabled ? props.theme.colors.l1ActiveEl : props.theme.colors.primary)};
    border-radius: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
`;

interface IInputLabelProps extends IsDisabled, IsActive {
    background: string;
}

export const InputLabel = styled.Text<IInputLabelProps>`
    font-size: ${props => (props.isActive ? rem(props, 1.4) : rem(props, 2))};
    position: absolute;
    left: ${props => (props.isActive ? rem(props, 0.8) : rem(props, 1.2))};
    top: ${props => (props.isActive ? rem(props, -1) : rem(props, 1.3))};
    z-index: ${props => (props.isActive ? 2 : -1)};
    color: ${props =>
        // eslint-disable-next-line no-nested-ternary
        props.isDisabled
            ? props.theme.colors.l1ActiveEl
            : props.isActive
              ? props.theme.colors.primary
              : props.theme.colors.l1ActiveEl};
    background: ${props => (props.isActive ? props.background : 'transparent')};
    padding: 0 ${props => rem(props, 0.4)};
`;

export const Input = styled.TextInput<IsDisabled>`
    padding: ${props => rem(props, 1.2)} ${props => rem(props, 1.6)};
    font-size: ${props => rem(props, 2)};
    color: ${props => (props.isDisabled ? props.theme.colors.l1ActiveEl : props.theme.colors.primary)};
    flex-grow: 1;
`;
export const InputError = styled(TextSemiBold16)`
    color: ${props => props.theme.colors.error};
`;

export const InputUnit = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${props => rem(props, 0.8)};
    margin: ${props => rem(props, 1.2)} ${props => rem(props, 1.6)};
    justify-content: center;
`;

export const UintText = styled(TextBold16)`
    color: ${props => props.theme.colors.l1ActiveEl};
`;
