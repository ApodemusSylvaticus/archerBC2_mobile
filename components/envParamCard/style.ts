import styled from 'styled-components/native';
import { DefaultCard } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';
import { AcceptButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';

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

export const WrapRow = styled(Row)`
    flex-wrap: wrap;
`;

export const Button = styled(AcceptButton)`
    align-self: end;
    margin-left: auto;
`;

export const ButtonText = styled(Text20)`
    color: ${props => props.theme.colors.primary};
`;

export const VelocityTextWrapper = styled.View`
    display: flex;
    flex-direction: row;
    gap: ${props => rem(props, 0.8)};
    align-items: flex-end;
`;
