import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';

export const DefaultButton = styled.Pressable`
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 2.4)};
    border-radius: 16px;
    background: ${props => props.theme.colors.l1ActiveEl};
    align-items: center;
    justify-content: center;
`;

export const DeleteButton = styled(DefaultButton)`
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${props => props.theme.colors.appBg};
    border: 2px solid ${props => props.theme.colors.error};
`;
