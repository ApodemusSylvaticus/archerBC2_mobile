import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Text20 = styled.Text`
    font-size: ${props => rem(props, 2)};
    font-family: Lato-Regular;
    color: ${props => props.theme.colors.primary};
`;

export const TextSemiBold24 = styled.Text`
    font-size: ${props => rem(props, 2.4)};
    font-family: Lato-Semibold;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
`;

export const TextSemiBold20 = styled.Text`
    font-size: ${props => rem(props, 2)};
    font-family: Lato-Semibold;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
`;

export const TextSemiBold18 = styled.Text`
    font-size: ${props => rem(props, 1.8)};
    font-family: Lato-Semibold;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
`;

export const ButtonTextBold18 = styled.Text`
    font-size: ${props => rem(props, 1.8)};
    font-family: Lato-Bold;
    font-weight: 700;
    text-align: center;
    color: ${props => props.theme.colors.primary};
`;

export const TextBold16 = styled.Text`
    font-size: ${props => rem(props, 1.6)};
    font-family: Lato-Bold;
    font-weight: 700;
    color: ${props => props.theme.colors.primary};
`;

export const TextSemiBold16 = styled.Text`
    font-size: ${props => rem(props, 1.6)};
    font-family: Lato-Semibold;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
`;

export const TextSemiBold12 = styled.Text`
    font-size: ${props => rem(props, 1.2)};
    font-family: Lato-Semibold;
    font-weight: 600;
    color: ${props => props.theme.colors.primary};
`;
