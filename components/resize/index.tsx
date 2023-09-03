import Slider from '@react-native-community/slider';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Text20 } from '@/components/text/styled';
import {
    ApplyButton,
    ApplyButtonText,
    Container,
    ExampleButton,
    ExampleButtonText,
    SliderContainer,
} from '@/components/resize/style';
import { useSettingStore } from '@/store/useSettingStore';

export const Resize: React.FC = () => {
    const { t } = useTranslation();
    const { size, setSize } = useSettingStore(state => ({ size: state.size, setSize: state.setSize }));
    const [sliderValue, setSliderValue] = useState(size);
    const {
        colors: { activeTab, primary },
    } = useTheme();

    const handleApply = () => {
        setSize(sliderValue);
    };

    return (
        <Container>
            <SliderContainer>
                <Text20>{t('default_elem_size')}</Text20>
                <Slider
                    style={{ flexGrow: 1 }}
                    step={1}
                    minimumValue={6}
                    maximumValue={12}
                    value={sliderValue}
                    onValueChange={setSliderValue}
                    minimumTrackTintColor={activeTab}
                    maximumTrackTintColor={primary}
                    thumbTintColor={activeTab}
                />
            </SliderContainer>

            <ExampleButton rem={sliderValue}>
                <ExampleButtonText rem={sliderValue}>{t('default_example_button')}</ExampleButtonText>
            </ExampleButton>

            <ApplyButton onPress={handleApply}>
                <ApplyButtonText>{t('default_apply_button')}</ApplyButtonText>
            </ApplyButton>
        </Container>
    );
};
