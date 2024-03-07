import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultButton } from '@/components/button/style';
import { SelectBulletModal } from '../modals/specificModal/selectBulletModal';
import { TextSemiBold20 } from '@/components/text/styled';

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
                <TextSemiBold20>{t('profile_riffle_list')}</TextSemiBold20>
            </DefaultButton>
            <SelectBulletModal isOpen={isOpen} closeHandler={closeHandler} bDiameter={bDiameter} />
        </>
    );
};
