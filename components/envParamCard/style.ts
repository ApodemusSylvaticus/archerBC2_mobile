import styled from 'styled-components/native';
import { DefaultCard } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';
import { DefaultButton } from '@/components/button/style';

export const Container = styled(DefaultCard)`
    flex-direction: column;
    display: flex;
    width: 100%;
    gap: ${props => rem(props, 1.6)};
    padding: ${props => rem(props, 1.2)} ${props => rem(props, 0.8)};
`;

export const Row = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    gap: ${props => rem(props, 0.8)};
`;

export const Button = styled(DefaultButton)`
    align-self: end;
    margin-left: auto;
`;
