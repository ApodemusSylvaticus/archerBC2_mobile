import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    display: flex;
    gap: ${props => rem(props, 1.6)};
`;
