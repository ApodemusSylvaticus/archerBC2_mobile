import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { TextBold16 } from '@/components/text/styled';

interface ContainerProps {
    right: number;
    left: number;
    top: number;
}
export const Container = styled.View<ContainerProps>`
    display: flex;
    flex-direction: row;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    width: 100%;
    padding-top: ${props => props.top + props.theme.rem * 1.6}px;
    padding-bottom: ${props => rem(props, 0.8)};
    padding-right: ${props => props.right + props.theme.rem * 0.8}px;
    padding-left: ${props => props.left + props.theme.rem * 0.8}px;
    background: ${props => props.theme.colors.appBg};
`;

export const TripleButtonContainer = styled.View`
    display: flex;
    flex-direction: row;
    width: 100%;
`;

interface ButtonProps {
    isActive: boolean;
}
export const Button = styled.Pressable`
    border-width: 1px;
    border-color: ${props => props.theme.colors.activeTab};
    padding: ${props => rem(props, 1.2)} 0;
    background: ${props => props.theme.colors.l1ActiveEl};
`;

export const FirstButton = styled(Button)`
    width: 30%;
`;

export const SecondButton = styled(Button)<ButtonProps>`
    background: ${props => (props.isActive ? props.theme.colors.l1ActiveEl : props.theme.colors.cardBg)};
    width: 40%;
`;

export const ThirdButton = styled(Button)`
    width: 30%;
`;

export const ButtonText = styled(TextBold16)`
    text-align: center;
`;
