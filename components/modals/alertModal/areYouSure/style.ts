import styled from 'styled-components/native';
import { DefaultCard, DefaultRow } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';
import { DefaultButton } from '@/components/button/style';

export const Container = styled.Pressable`
    width: clamp(200px, 60%, 600px);
`;

export const CardContainer = styled(DefaultCard)`
    padding: ${props => rem(props, 2.4)};
    align-items: center;
`;

export const Row = styled(DefaultRow)`
    width: 100%;
    justify-content: space-around;
`;

export const Button = styled(DefaultButton)`
    width: 35%;
`;
