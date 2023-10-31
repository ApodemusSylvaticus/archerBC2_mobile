import React from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';
import { Button, Container } from '@/components/modals/chooseActiveProfileModal/style';
import { Text20 } from '@/components/text/styled';
import { DefaultModal } from '@/components/modals/DefaultModal';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { DefaultRowFlex1 } from '@/components/container/defaultBox';

export const ChooseActiveProfileModal: React.FC = () => {
    const { t } = useTranslation();
    const { isChooseActiveProfileOpen, closeChooseActiveProfileModal } = useModalControllerStore(state => ({
        isChooseActiveProfileOpen: state.isChooseActiveProfileOpen,
        closeChooseActiveProfileModal: state.closeChooseActiveProfileModal,
    }));
    const { activeProfile, fileList, setActiveProfile } = useActiveProfileStore(state => ({
        activeProfile: state.activeProfile,
        fileList: state.fileList,
        setActiveProfile: state.setActiveProfile,
    }));

    const handlePressButton = (el: string) => {
        closeChooseActiveProfileModal();
        setActiveProfile(el);
    };

    return (
        <DefaultModal backButtonHandler={closeChooseActiveProfileModal} isVisible={isChooseActiveProfileOpen}>
            {fileList.map(el => (
                <Container isDisabled={activeProfile === el} key={el}>
                    <DefaultRowFlex1>
                        <Text20>{el}</Text20>
                    </DefaultRowFlex1>

                    <Button
                        isDisabled={activeProfile === el}
                        onPress={() => activeProfile !== el && handlePressButton(el)}>
                        <Text20>{t('default_select')}</Text20>
                    </Button>
                </Container>
            ))}
        </DefaultModal>
    );
};
