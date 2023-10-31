import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { SelectCaliberModal } from '@/components/modals/specificModal/selectCaliberModal';

export const SelectCaliberFromListButton: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const openHandler = () => setIsOpen(true);
    const closeHandler = () => setIsOpen(false);

    return (
        <>
            <DefaultButton onPress={openHandler}>
                <Text20>{t('profile_riffle_list')}</Text20>
            </DefaultButton>
            <SelectCaliberModal isOpen={isOpen} closeHandler={closeHandler} />
        </>
    );
};
