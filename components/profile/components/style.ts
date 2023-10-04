import styled from 'styled-components/native';
import { ButtonTextBold18, Text20 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { SeparateRow } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';

export const ButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.primary};
`;

export const SubmitButton = styled(DefaultButton)`
    margin-left: auto;
`;

export const SubmitButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.primary};
`;

export const TextWithUintContainer = styled.View`
    display: flex;
    flex-direction: row;
    gap: 6px;
    border-color: ${props => props.theme.colors.primary};
`;

export const TextWithUintBorderRight = styled(TextWithUintContainer)`
    border-right-width: 1px;
    flex: 1;
    justify-content: flex-start;
`;

export const TextWithUintBorderLeft = styled(TextWithUintContainer)`
    border-left-width: 1px;
    flex: 1;
    justify-content: flex-end;
`;

export const CoefRow = styled(SeparateRow)`
    border: 1px solid ${props => props.theme.colors.primary};
    border-left-width: 0;
    border-right-width: 0;
    padding: ${props => rem(props, 0.8)} 0;
`;

export const Text20Uint = styled(Text20)`
    color: ${props => props.theme.colors.l1ActiveEl};
`;
