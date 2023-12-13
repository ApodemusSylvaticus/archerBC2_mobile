import React, { PropsWithChildren, useEffect, useState } from 'react';
import { NumericInputProps } from '@/interface/components/input';
import { Container, Input, InputError, InputLabel, InputUnit, InputWrapper, UintText } from './style';
import { regexNumeric } from '@/constant/regex';

export const NumericInput: React.FC<PropsWithChildren<NumericInputProps>> = ({
    style,
    touched,
    background,
    label,
    error,
    value,
    onChangeText,
    onBlur,
    schema,
    uint,
    children,
    disabled,
}) => {
    const [isActive, setIsActive] = useState(!!value);
    const [handleError, setHandleError] = useState('');
    const handleFocus = () => {
        setIsActive(true);
        setHandleError('');
    };

    useEffect(() => {
        setIsActive(!!value);
    }, [value]);

    const handleBlur = async (str: string) => {
        onBlur(str);
        if (schema) {
            try {
                await schema.validate(value);
            } catch (e: any) {
                setHandleError(e.errors[0]);
            }
        }

        if (value === '') {
            setIsActive(false);
        }
    };

    const handleOnChangeText = (text: string) => {
        const newText = text.replace(',', '.');

        if (newText.startsWith('-0') && newText.length > 2 && newText[2] !== '.') {
            onChangeText(`-${text[2]}`);

            return;
        }

        if (newText.startsWith('0') && text.length > 1 && newText[1] !== '.') {
            onChangeText(newText[1]);

            return;
        }

        if (newText.length === 0) {
            onChangeText(newText);

            return;
        }
        if (newText.length === 1 && newText === '-') {
            onChangeText(newText);

            return;
        }

        if (newText.length === 2 && newText === '-0') {
            onChangeText(newText);

            return;
        }

        const lastIndex = newText.length - 1;

        const lastLetter = newText.at(-1);

        if (lastLetter === '.' && newText.indexOf('.') === lastIndex) {
            onChangeText(newText);
            return;
        }

        if (regexNumeric.test(newText)) {
            onChangeText(newText);
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
                    selectTextOnFocus={false}
                    value={value}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    isDisabled={!!disabled}
                    keyboardType="numeric"
                    onChangeText={handleOnChangeText}
                />
                {(!!uint || children) && (
                    <InputUnit>
                        {!!uint && <UintText>{uint}</UintText>}
                        {children}
                    </InputUnit>
                )}
            </InputWrapper>
            {((touched && !!error) || !!handleError) && <InputError>{error || handleError}</InputError>}
        </Container>
    );
};
