import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { TextBold16 } from '@/components/text/styled';
import { VerticalLine } from '@/components/line';

export const Container = styled.View``;

export const TripleButtonContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 16px;
    border-width: 2px;
    margin: ${props => rem(props, 1.6)} ${props => rem(props, 0.8)} 0;
    border-color: ${props => props.theme.colors.activeTab};
    overflow: hidden;
    background: ${props => props.theme.colors.l1ActiveEl};
`;

export const Button = styled.Pressable`
    padding: ${props => rem(props, 1.2)} 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    background: ${props => props.theme.colors.l1ActiveEl};
`;

export const FirstButton = styled(Button)`
    flex-grow: 3;
    max-width: 30%;
`;

export const SecondButton = styled(Button)`
    background: ${props => props.theme.colors.l1ActiveEl};
    flex-grow: 4;
`;

export const ThirdButton = styled(Button)`
    flex-grow: 3;
    max-width: 30%;
`;

export const ButtonText = styled(TextBold16)`
    text-align: center;
`;

export const Line = styled(VerticalLine)`
    height: 60%;
    width: 2px;
    border-radius: 16px;
`;
