import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const DistanceContainer = styled.TouchableOpacity`
    display: flex;
    flex-direction: row;
    border-radius: 16px;
    justify-content: space-between;
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
    margin-bottom: ${props => rem(props, 1)};
`;
