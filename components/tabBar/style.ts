import styled from 'styled-components/native';

export const Container = styled.View`
    background: ${props => props.theme.colors.l1ActiveEl};
    position: fixed;
    bottom: 0;
    display: flex;
    flex-direction: row;
    width: 100%;
    border: 1px solid ${props => props.theme.colors.appBg};
`;
