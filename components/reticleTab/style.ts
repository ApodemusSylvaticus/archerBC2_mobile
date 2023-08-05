import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 0.8)} ${props => rem(props, 0.8)}
        ${props => rem(props, 0.4)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: turquoise;
    border-radius: 2px;
`;

export const NameBlock = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${props => rem(props, 1.6)};
`;

export const ActualLabel = styled.View`
    padding: ${props => rem(props, 0.4)} ${props => rem(props, 0.8)};
    background: #424242;
    border-radius: 4px;
`;

export const ReticlesMock = styled.View`
    width: ${props => rem(props, 4)};
    height: ${props => rem(props, 4)};
    border-radius: 2px;
    background: cadetblue;
`;
