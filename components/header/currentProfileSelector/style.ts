import styled from 'styled-components/native';
import { DefaultButton } from '@/components/button/style';
import { rem } from '@/helpers/rem';

export const Button = styled(DefaultButton)`
    width: 75%;
    margin: ${props => rem(props, 1.6)} auto;
    display: flex;
    align-items: center;
`;
