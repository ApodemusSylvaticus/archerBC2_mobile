import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const Container = styled.TouchableOpacity`
    padding: ${props => rem(props, 0.8)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: ${props => props.theme.colors.l1ActiveEl};
    border-radius: 16px;
`;

export const NameBlock = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${props => rem(props, 1.6)};
`;

export const Img = styled.Image`
    width: ${props => rem(props, 4.8)};
    height: ${props => rem(props, 4.8)};
    border-radius: 8px;
`;
