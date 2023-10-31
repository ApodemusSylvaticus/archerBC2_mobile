import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { DefaultButton } from '@/components/button/style';
import { IsDisabled } from '@/interface/components/defaultStyleProps';

export const Container = styled.View<IsDisabled>`
    display: flex;
    padding: ${props => rem(props, 0.8)} ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
    border: 2px solid ${props => (props.isDisabled ? props.theme.colors.activeTab : props.theme.colors.cardBg)};
    border-radius: 16px;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

export const Button = styled(DefaultButton)<IsDisabled>`
    opacity: ${props => (props.isDisabled ? 0 : 1)};
`;
