import styled from 'styled-components/native';
import { rem } from '@/helpers/rem';
import { Text20 } from '@/components/text/styled';

export const Container = styled.View<{ zIndex: number }>`
    width: 100%;
    position: relative;
    z-index: ${props => props.zIndex};
`;

export const PressableTextContainer = styled.Pressable`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: ${props => rem(props, 1.2)} ${props => rem(props, 1.6)};
    border: 1px solid ${props => props.theme.colors.secondary};
    border-radius: 16px;
`;

export const Text = styled(Text20)<{ isActive: boolean }>`
    color: ${props => (props.isActive ? props.theme.colors.secondary : props.theme.colors.l1ActiveEl)};
`;

interface SelectBoxProps {
    size: number;
}

export const SelectBox = styled.View<SelectBoxProps>`
    display: flex;
    flex-direction: column;
    position: absolute;
    z-index: 100;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: ${props => (props.size === 0 ? 0 : 1)};

    transform: translateY(${props => props.size}px);
`;

export const SelectItem = styled.Pressable`
    position: relative;
    z-index: 10;
    border: 1px solid ${props => props.theme.colors.secondary};
    padding: ${props => rem(props, 1.2)} ${props => rem(props, 1.6)};
    background: ${props => props.theme.colors.cardBg};
`;
