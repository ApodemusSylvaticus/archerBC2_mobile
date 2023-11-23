import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { Text20, TextSemiBold20 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';

export const Container = styled.View`
    width: 100%;
    flex: 1;
    background: ${props => props.theme.colors.cardBg};
    padding: ${props => rem(props, 1.6)} ${props => rem(props, 0.8)};
`;

export const BackButton = styled(DefaultButton)`
    align-self: baseline;
    margin-bottom: ${props => rem(props, 1.6)};
`;

export const RiffleName = styled(Text20)`
    flex: 1;
`;
export const ItemContainer = styled.View`
    display: flex;
    flex-direction: row;
    padding: ${props => rem(props, 0.8)};
    border: 1px solid ${props => props.theme.colors.l1ActiveEl};
    align-items: center;
    gap: ${props => rem(props, 1.6)};
    border-radius: 16px;
    margin-top: 8px;
`;

export const NotFoundText = styled(TextSemiBold20)`
    margin-top: ${props => rem(props, 1.6)};
`;
