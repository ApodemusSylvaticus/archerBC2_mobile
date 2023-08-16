import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { ButtonTextBold18 } from '@/components/text/styled';

export const ButtonContainer = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${props => rem(props, 1)};
`;

export const MultiCoefficientWrapper = styled.View`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    width: 100%;
    gap: ${props => rem(props, 0.4)};
`;

export const ErrorText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.error};
`;
