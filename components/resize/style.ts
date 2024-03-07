import styled from 'styled-components/native';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    padding: ${props => rem(props, 0.8)};
    border-radius: 16px;
    display: flex;
    gap: ${props => rem(props, 0.8)};

    background: ${props => props.theme.colors.cardBg};
`;

export const SliderContainer = styled.View`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${props => rem(props, 0.8)};
`;

interface ExampleButtonProps {
    rem: number;
}
export const ExampleButton = styled(DefaultButton)<ExampleButtonProps>`
    padding: ${props => props.rem * 0.8}px ${props => props.rem * 2.4}px;
    margin: ${props => rem(props, 1.6)} auto 0;
`;

export const ExampleButtonText = styled(TextSemiBold20)<ExampleButtonProps>`
    font-size: ${props => props.rem * 2}px;
`;

export const ApplyButton = styled(AcceptButton)`
    margin-top: ${props => rem(props, 1.6)};
    margin-left: auto;
`;

export const ApplyButtonText = styled(TextSemiBold20)`
    color: ${props => props.theme.colors.primary};
`;
