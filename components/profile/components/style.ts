import styled from 'styled-components/native';
import { ButtonTextBold18 } from '@/components/text/styled';

export const ButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.secondary};
`;
