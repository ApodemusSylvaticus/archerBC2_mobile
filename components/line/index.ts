import styled from 'styled-components/native';

export const Line = styled.View`
    flex-grow: 1;
    height: 1px;
    background: ${props => props.theme.colors.appBg};
`;
