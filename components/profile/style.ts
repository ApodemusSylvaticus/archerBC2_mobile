import styled from 'styled-components/native';
import { SeparateRow } from '@/components/container/defaultBox';
import { rem } from '@/helpers/rem';

export const ButtonContainer = styled(SeparateRow)`
    margin-bottom: ${props => rem(props, 0.8)};
    position: fixed;
`;
