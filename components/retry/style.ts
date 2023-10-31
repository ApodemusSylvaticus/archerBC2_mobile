import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { DefaultRow } from '@/components/container/defaultBox';
import { Text20 } from '@/components/text/styled';

export const RetryWithErrorMsgContainer = styled.View`
    display: flex;
    gap: ${props => rem(props, 1.6)};
`;

export const ErrorContainer = styled(DefaultRow)`
    align-items: center;
`;

export const ErrorMsg = styled(Text20)`
    color: ${props => props.theme.colors.error};
`;
