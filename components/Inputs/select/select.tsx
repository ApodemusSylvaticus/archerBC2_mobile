import React, { useState } from 'react';
import { useClickOutside } from 'react-native-click-outside';
import { useTheme } from 'styled-components/native';
import { Container, PressableTextContainer, SelectBox, SelectItem, Text } from '@/components/Inputs/select/style';
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
}

// TODO: add req
export const SelectInput: React.FC<SelectInputProps> = ({ list, setElem, chosenEl, background, label, zIndex = 3 }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const ref = useClickOutside(() => setIsOpen(false));
    const { rem, colors } = useTheme();
    const [elemHeight, setElemHeight] = useState<number>(0);

    const handlePress = (index: number) => {
        setIsOpen(false);
        setElem(index);
    };

    const listMap = list.map((el, index) => {
        if (index !== list.length - 1) {
            return (
                <SelectItem key={el} style={{ borderTopWidth: 0 }} onPress={() => handlePress(index)}>
                    <Text isActive>{el}</Text>
                </SelectItem>
            );
        }
        return (
            <SelectItem
                key={el}
                style={{ borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderTopWidth: 0 }}
                onPress={() => handlePress(index)}>
                <Text isActive>{el}</Text>
            </SelectItem>
        );
    });
    // TODO  <PureArrow size={15} orientation="bottom" fillColor="white" />
    return (
        <Container zIndex={zIndex}>
            <PressableTextContainer
                style={isOpen && { borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                onPress={() => setIsOpen(prevState => !prevState)}>
                <Text isActive={!!chosenEl || chosenEl === 0}>
                    {chosenEl || chosenEl === 0 ? list[chosenEl] : label}
                </Text>
                <PureArrow size={rem * 1.5} orientation={isOpen ? 'top' : 'bottom'} fillColor={colors.secondary} />
            </PressableTextContainer>
            {chosenEl !== null && (
                <InputLabel isActive background={background}>
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
                    {listMap}
                </SelectBox>
            )}
        </Container>
    );
};
