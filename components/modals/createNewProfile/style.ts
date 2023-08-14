import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.SafeAreaView`
    width: 100%;
    height: 100%;
    padding: ${props => rem(props, 1.6)};
    gap: ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.appBg};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
