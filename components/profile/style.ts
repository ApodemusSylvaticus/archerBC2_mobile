import styled from 'styled-components/native';
import { DefaultCard, SeparateRow } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';

export const ButtonContainer = styled(SeparateRow)`
    margin-bottom: ${props => rem(props, 0.8)};
    position: fixed;
`;

interface ProfileTabCardProps {
    isSelected: boolean;
}
export const ProfileTabCard = styled(DefaultCard)<ProfileTabCardProps>`
    border: 2px solid;
    border-color: ${props => (props.isSelected ? props.theme.colors.activeTab : props.theme.colors.cardBg)};
`;
