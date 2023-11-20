import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

interface DistanceContainerProps {
    isActive: boolean;
}
export const DistanceContainer = styled.TouchableOpacity<DistanceContainerProps>`
    display: flex;
    flex-direction: row;
    border: 3px solid ${props => (props.isActive ? props.theme.colors.activeTab : props.theme.colors.cardBg)};
    border-radius: ${props => (props.isActive ? 0 : '16px')};
    justify-content: space-between;
    align-items: center;
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
    margin-bottom: ${props => rem(props, 0.8)};
`;
