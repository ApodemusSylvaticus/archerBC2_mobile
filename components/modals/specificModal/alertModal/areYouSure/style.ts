import styled from 'styled-components/native';
import { DefaultCard, DefaultRow } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';

export const Container = styled.Pressable`
    width: clamp(200px, 85%, 600px);
`;

export const CardContainer = styled(DefaultCard)`
    padding: ${props => rem(props, 1)};
    align-items: center;
`;

export const Header = styled(Text20)`
    text-align: center;
`;

export const Row = styled(DefaultRow)`
    width: 100%;
    justify-content: space-between;
    gap: ${props => rem(props, 0.8)};
`;

export const Button = styled(DefaultButton)`
    width: 100%;
`;

export const DefaultAcceptButton = styled(AcceptButton)`
    width: 100%;
`;
