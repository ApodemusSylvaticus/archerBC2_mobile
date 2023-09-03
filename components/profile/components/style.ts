import styled from 'styled-components/native';
import { ButtonTextBold18 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';

export const ButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.primary};
`;

export const SubmitButton = styled(DefaultButton)`
    margin-left: auto;
`;

export const SubmitButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.primary};
`;
