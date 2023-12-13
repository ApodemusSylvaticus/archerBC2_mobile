import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.Pressable`
    position: relative;
    width: 50%;
    height: ${props => rem(props, 6.4)};
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
`;
