import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const ButtonContainer = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: ${props => rem(props, 1)};
`;
