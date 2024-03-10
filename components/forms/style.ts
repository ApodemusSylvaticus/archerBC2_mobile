import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { TextSemiBold20 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';

export const ButtonContainer = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${props => rem(props, 1)};
    padding-bottom: 40px;
`;

export const MultiCoefficientWrapper = styled.View`
    display: flex;
    flex-direction: row;
    align-items: baseline;
    width: 100%;
    gap: ${props => rem(props, 0.8)};
`;

export const AddNewCoeffButton = styled(DefaultButton)`
    max-width: max-content;
    align-self: center;
    margin-top: ${props => rem(props, 0.8)};
`;
export const ErrorText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.error};
`;
