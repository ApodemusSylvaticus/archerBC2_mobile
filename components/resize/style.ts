import styled from 'styled-components/native';
import { DefaultButton } from '@/components/button/style';
import { ButtonTextBold18 } from '@/components/text/styled';
import { rem } from '@/helpers/rem';

export const Container = styled.View`
    padding: 10px;
    border-radius: 16px;
    display: flex;
    gap: 8px;

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
    margin: ${props => rem(props, 2)} auto 0;
`;

export const ExampleButtonText = styled(ButtonTextBold18)<ExampleButtonProps>`
    font-size: ${props => props.rem * 1.8}px;
`;

export const ApplyButton = styled(DefaultButton)`
    margin-top: ${props => rem(props, 2)};
    margin-left: auto;
`;

export const ApplyButtonText = styled(ButtonTextBold18)`
    color: ${props => props.theme.colors.primary};
`;
