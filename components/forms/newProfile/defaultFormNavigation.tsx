import React from 'react';
import { useTheme } from 'styled-components/native';
import { ButtonContainer } from '@/components/forms/style';
import { ArrowSVG } from '@/components/svg/arrow';

interface DefaultFormNavigationProps {
    goBackAction: () => void;
    goForwardAction: () => void;
    goBackButtonColor: string;
    goForwardButtonColor: string;
}
export const DefaultFormNavigation: React.FC<DefaultFormNavigationProps> = ({
    goBackAction,
    goForwardAction,
    goForwardButtonColor,
    goBackButtonColor,
}) => {
    const { rem } = useTheme();
    return (
        <ButtonContainer>
            <ArrowSVG
                orientation="left"
                width={rem * 5.5}
                height={rem * 5.5}
                fillColor={goBackButtonColor}
                onPress={goBackAction}
            />
            <ArrowSVG
                orientation="right"
                width={rem * 5.5}
                height={rem * 5.5}
                fillColor={goForwardButtonColor}
                onPress={goForwardAction}
            />
        </ButtonContainer>
    );
};
