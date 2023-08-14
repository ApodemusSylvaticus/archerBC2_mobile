import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const DefaultContainer = styled.View`
    display: flex;
    width: 100%;
    padding: 0 ${props => rem(props, 0.8)};
    flex-direction: column;
    gap: ${props => rem(props, 1.6)};
`;

export const DefaultBox = styled.View`
    display: flex;
    width: 100%;
    padding: ${props => rem(props, 0.8)};
`;

export const DefaultCard = styled(DefaultBox)`
    flex-direction: column;
    border-radius: 4px;
    gap: ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
`;

export const DefaultRow = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: ${props => rem(props, 0.8)};
`;

export const SeparateRow = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
`;
