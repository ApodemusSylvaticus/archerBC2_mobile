import React, { useState } from 'react';
import { KeyboardTypeOptions, ViewStyle } from 'react-native';
import { Input, InputError, InputLabel, InputWrapper } from '@/components/Inputs/style';

interface DefaultInputProps {
    value: string;
    onChangeText: (text: string) => void;
    label: string;
    error?: string;
    touched?: boolean;
    onBlur: (text: string) => void;
    background: string;
    keyboardType?: KeyboardTypeOptions;
    style?: ViewStyle;
}

export const DefaultInput: React.FC<DefaultInputProps> = ({
    value,
    onChangeText,
    label,
    error,
    touched,
    background,
    onBlur,
    keyboardType = 'default',
    style,
}) => {
    const [isActive, setIsActive] = useState(!!value);
    const handleFocus = () => {
        setIsActive(true);
    };

    const handleClose = () => {
        if (value === '') {
            setIsActive(false);
        }
    };

    const handleOnChangeText = (text: string) => {
        if (keyboardType === 'numeric') {
            if (text.at(-1) === ',') {
                const newText = text.replace(',', '.');
                onChangeText(newText);
                return;
            }
            if (text.at(-1) === '-') {
                return;
            }
            if (text.at(-1) === ' ') {
                return;
            }
        }
        onChangeText(text);
    };

    return (
        <InputWrapper style={style}>
            <InputLabel isActive={isActive} background={background}>
                {label}
            </InputLabel>
            <Input
                value={value}
                onFocus={handleFocus}
                onBlur={onBlur}
                keyboardType={keyboardType}
                onEndEditing={handleClose}
                onChangeText={handleOnChangeText}
            />
            {touched && error && <InputError>{error}</InputError>}
        </InputWrapper>
    );
};
