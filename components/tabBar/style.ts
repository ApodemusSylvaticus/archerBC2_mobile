import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    background: #616161;
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid ${props => props.theme.colors.appBg};
    /*
    margin-top: ${props => rem(props, 0.8)};
*/
`;
