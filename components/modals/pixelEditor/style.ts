import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const ToolsContainer = styled.View`
    margin-top: ${props => rem(props, 1.6)};
    padding: 0 ${props => rem(props, 1)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const PressableTool = styled.Pressable`
    padding: ${props => rem(props, 1.6)} ${props => rem(props, 2.4)};
`;

export const HistoryContainer = styled.View`
    margin-top: ${props => rem(props, 1.6)};
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: ${props => rem(props, 1.6)};
`;
