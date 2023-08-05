import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

interface IContainerProps {
    isActive: boolean;
}

export const Container = styled.View<IContainerProps>`
    padding: ${props => rem(props, 0.4)} 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${props => rem(props, 0.4)};
    background: ${props => (props.isActive ? '#757575' : 'transparent')};
`;

export const MockImg = styled.View`
    width: ${props => rem(props, 2.5)};
    height: ${props => rem(props, 2.5)};
    background: blueviolet;
`;
