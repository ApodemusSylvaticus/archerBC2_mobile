import React, { useState } from 'react';
import { useClickOutside } from 'react-native-click-outside';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import {
    AlreadyExistLabel,
    Container,
    PressableTextContainer,
    SelectBox,
    SelectItem,
    Text,
} from '@/components/Inputs/select/style';
import { Nullable } from '@/interface/helper';
import { InputLabel } from '@/components/Inputs/style';
import { PureArrow } from '@/components/svg/pureArrow';

interface SelectInputProps {
    list: string[];
    setElem: (index: number) => void;
    chosenEl: Nullable<number>;
    label: string;
    background: string;
    zIndex?: number;
    alreadyExistArr?: number[];
    baseValue?: number;
}

// TODO: add req
export const SelectInput: React.FC<SelectInputProps> = ({
    list,
    setElem,
    chosenEl,
    background,
    label,
    zIndex = 3,
    alreadyExistArr = [],
    baseValue,
}) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useClickOutside(() => setIsOpen(false));
    const { rem, colors } = useTheme();
    const [elemHeight, setElemHeight] = useState<number>(0);
    const { t } = useTranslation();
    const handlePress = (index: number) => {
        setIsOpen(false);
        setElem(index);
    };

    return (
        <Container zIndex={zIndex}>
            <PressableTextContainer
                style={isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                onPress={() => setIsOpen(prevState => !prevState)}>
                <Text isActive={!!chosenEl || chosenEl === 0}>
                    {chosenEl || chosenEl === 0 ? list[chosenEl] : label}
                </Text>
                <PureArrow
                    width={rem * 1.5}
                    height={rem * 1.5}
                    orientation={isOpen ? 'top' : 'bottom'}
                    fillColor={colors.primary}
                />
            </PressableTextContainer>
            {chosenEl !== null && (
                <InputLabel isActive background={background} isDisabled={false}>
                    {label}
                </InputLabel>
            )}
            {isOpen && (
                <SelectBox
                    size={elemHeight}
                    ref={ref}
                    onLayout={event => {
                        const { height } = event.nativeEvent.layout;
                        setElemHeight(height);
                    }}>
                    {list.map((el, index) => {
                        if (index !== list.length - 1) {
                            return (
                                <SelectItem key={el} style={{ borderTopWidth: 0 }} onPress={() => handlePress(index)}>
                                    <Text isActive>{el}</Text>

                                    {baseValue === index && (
                                        <AlreadyExistLabel>{t('default_current')}</AlreadyExistLabel>
                                    )}
                                    {baseValue !== index &&
                                        alreadyExistArr.includes(index) &&
                                        !(!!baseValue && baseValue === index) && (
                                            <AlreadyExistLabel>{t('default_already_exist')}</AlreadyExistLabel>
                                        )}
                                </SelectItem>
                            );
                        }
                        return (
                            <SelectItem
                                key={el}
                                style={{ borderBottomLeftRadius: 16, borderBottomRightRadius: 16, borderTopWidth: 0 }}
                                onPress={() => handlePress(index)}>
                                <Text isActive>{el}</Text>
                                {baseValue === index && <AlreadyExistLabel>{t('default_current')}</AlreadyExistLabel>}
                                {baseValue !== index &&
                                    alreadyExistArr.includes(index) &&
                                    !(!!baseValue && baseValue === index) && (
                                        <AlreadyExistLabel>{t('default_already_exist')}</AlreadyExistLabel>
                                    )}
                            </SelectItem>
                        );
                    })}
                </SelectBox>
            )}
        </Container>
    );
};
