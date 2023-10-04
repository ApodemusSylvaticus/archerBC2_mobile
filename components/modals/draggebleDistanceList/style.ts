import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { DefaultRow } from '@/components/container/defaultBox';

export const InputWrapper = styled(DefaultRow)`
    margin-bottom: ${props => rem(props, 0.8)};
`;
