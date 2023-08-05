import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const DefaultContainer = styled.View`
    display: flex;
    padding: 0 ${props => rem(props, 0.8)};
    flex-direction: column;
    gap: ${props => rem(props, 1.6)};
`;

export const DefaultBox = styled.View`
    display: flex;
    background: ${props => props.theme.colors.grey700};
    width: 100%;
    padding: ${props => rem(props, 0.8)};
`;

export const DefaultCard = styled(DefaultBox)`
    flex-direction: column;
    gap: ${props => rem(props, 1.6)};
`;

export const DefaultRow = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${props => rem(props, 0.8)};
`;

export const SeparateRow = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
