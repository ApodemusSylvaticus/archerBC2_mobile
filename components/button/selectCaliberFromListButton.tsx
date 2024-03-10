import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { SelectCaliberModal } from '@/components/modals/specificModal/selectCaliberModal';

export const SelectCaliberFromListButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const openHandler = () => setIsOpen(true);
    const closeHandler = () => setIsOpen(false);

    return (
        <>
            <DefaultButton onPress={openHandler}>
                <TextSemiBold20>{t('profile_riffle_list')}</TextSemiBold20>
            </DefaultButton>
            <SelectCaliberModal isOpen={isOpen} closeHandler={closeHandler} />
        </>
    );
};
