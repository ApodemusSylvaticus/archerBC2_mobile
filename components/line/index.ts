import styled from 'styled-components/native';

export const Line = styled.View`
    flex-grow: 1;
    height: 1px;
    background: ${props => props.theme.colors.appBg};
`;

export const VerticalLine = styled.View`
    height: 100%;
    width: 1px;
    background: ${props => props.theme.colors.activeTab};
`;

export const VerticalLinePrimary = styled(VerticalLine)`
    background: ${props => props.theme.colors.primary};
`;
