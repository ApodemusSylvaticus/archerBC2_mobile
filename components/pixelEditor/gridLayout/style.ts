import styled from 'styled-components/native';

export const Container = styled.View`
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    position: absolute;
    justify-content: flex-start;
    align-items: flex-start;
    top: 0;
    left: 0;
`;

interface CeilProps {
    size: number;
    totalWidth: number;
}
export const Cell = styled.View<CeilProps>`
    width: ${props => props.totalWidth / props.size}px;
    aspect-ratio: 1 / 1;
    border-color: ${props => props.theme.colors.l1ActiveEl};
`;
