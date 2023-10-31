import styled from 'styled-components/native';
import { TextSemiBold20 } from '@/components/text/styled';

export const ErrorText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.error};
    text-align: center;
`;
