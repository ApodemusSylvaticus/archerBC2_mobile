import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { Button, Modal } from 'react-native';
import { AppContainer } from '@/components/container/appContainer';
import { languageArray } from '@/i18n';
import { useSettingStore } from '@/store/useSettingStore';
import { darkTheme, lightDark, lightTheme } from '@/constant/theme';
import { Resize } from '@/components/resize';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { SelectInput } from '@/components/Inputs/select/select';
import { PreloadPixelEditor } from '@/components/pixelEditor';

const Modalss: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
    return (
        <Modal animationType="slide" visible={isOpen} supportedOrientations={['landscape']}>
            {isOpen && <PreloadPixelEditor />}
        </Modal>
    );
};

const Setting: React.FC = () => {
    const { t } = useTranslation();
    const { language, setLanguage, setTheme, theme } = useSettingStore(state => ({
        language: state.language,
        setLanguage: state.setLanguage,
        setTheme: state.setTheme,
        theme: state.theme,
    }));
    const [activeLanguage, setActiveLanguage] = useState(languageArray.findIndex(el => el.simbol === language));
    const { colors } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const handleChangeLanguage = (value: number) => {
        setActiveLanguage(value);
        setLanguage(languageArray[value].simbol);
    };

    const themeList = [darkTheme, lightTheme, lightDark];
    const themeNameList = [t('default_dark_theme'), t('default_light_theme'), '3'];

    const handleChangeTheme = (value: number) => {
        setTheme(themeList[value]);
    };

    return (
        <AppContainer>
            <DefaultColumnContainer>
                <Resize />

                <SelectInput
                    label={t('default_interface_language')}
                    background={colors.appBg}
                    list={languageArray.map(el => el.value)}
                    setElem={handleChangeLanguage}
                    chosenEl={activeLanguage}
                    zIndex={5}
                />

                <SelectInput
                    label={t('default_select_theme')}
                    background={colors.appBg}
                    list={themeNameList}
                    setElem={handleChangeTheme}
                    chosenEl={themeList.findIndex(el => el.name === theme.name)}
                    zIndex={4}
                />
            </DefaultColumnContainer>

            <Button title="test" onPress={() => setIsOpen(true)} />
            <Modalss isOpen={isOpen} />
        </AppContainer>
    );
};

export default Setting;
