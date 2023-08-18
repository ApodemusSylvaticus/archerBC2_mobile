import { ViewStyle } from 'react-native';
import { NumberSchema } from 'yup';

export interface DefaultInputProps {
    value: string;
    onChangeText: (text: string) => void;
    label: string;
    error?: string;
    touched?: boolean;
    onBlur: (text: string) => void;
    background: string;
    style?: ViewStyle;
}

export interface NumericInputProps extends DefaultInputProps {
    uint?: string;
    schema?: NumberSchema;
}
