import React from 'react';
import { useTranslation } from 'react-i18next';
import { TextSemiBold20 } from '@/components/text/styled';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { Button } from '@/components/header/currentProfileSelector/style';
import { useActiveProfileStore } from '@/store/useActiveProfileStore';

export const CurrentProfileSelector: React.FC = () => {
    const { t } = useTranslation();
    const { openChooseActiveProfileModal } = useModalControllerStore(state => ({
        openChooseActiveProfileModal: state.openChooseActiveProfileModal,
    }));

    const list = useActiveProfileStore(state => state.fileList);

    if (list.length < 2) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }

    return (
        <Button onPress={openChooseActiveProfileModal}>
            <TextSemiBold20>{t('profile_choose_another_profile')}</TextSemiBold20>
        </Button>
    );
};
