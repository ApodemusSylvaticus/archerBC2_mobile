import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from '@/components/button/style';
import { SelectBulletModal } from '../modals/specificModal/selectBulletModal';
import { Text20 } from '@/components/text/styled';

interface SelectBulletFromListButtonProps {
    bDiameter: string;
}
export const SelectBulletFromListButton: React.FC<SelectBulletFromListButtonProps> = ({ bDiameter }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useTranslation();
    const openHandler = () => setIsOpen(true);
    const closeHandler = () => setIsOpen(false);

    return (
        <>
            <DefaultButton onPress={openHandler}>
                <Text20>{t('profile_riffle_list')}</Text20>
            </DefaultButton>
            <SelectBulletModal isOpen={isOpen} closeHandler={closeHandler} bDiameter={bDiameter} />
        </>
    );
};
