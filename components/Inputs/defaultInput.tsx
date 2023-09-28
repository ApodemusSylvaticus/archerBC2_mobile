import React, { useState } from 'react';
import { Container, Input, InputError, InputLabel, InputWrapper } from '@/components/Inputs/style';
import { DefaultInputProps } from '@/interface/components/input';

export const DefaultInput: React.FC<DefaultInputProps> = ({
    value,
    onChangeText,
    label,
    error,
    touched,
    background,
    onBlur,
    disabled,
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

    return (
        <Container style={style}>
            <InputWrapper isDisabled={!!disabled}>
                <InputLabel isDisabled={!!disabled} isActive={isActive} background={background}>
                    {label}
                </InputLabel>
                <Input
                    editable={!disabled}
                    isDisabled={!!disabled}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={onBlur}
                    onEndEditing={handleClose}
                    onChangeText={onChangeText}
                />
            </InputWrapper>
            {touched && error && <InputError>{error}</InputError>}
        </Container>
    );
};
