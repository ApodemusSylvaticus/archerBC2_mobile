import React, { useCallback, useState } from 'react';
import { DeleteButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { AreYouSureModal } from '@/components/modals/specificModal/alertModal/areYouSure';

interface DeleteButtonWithConfProps {
    buttonText: string;
    confirmMsg: string;
    confirmHandler: () => Promise<void>;
}

export const DeleteButtonWithConfirm: React.FC<DeleteButtonWithConfProps> = ({
    buttonText,
    confirmHandler,
    confirmMsg,
}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirm = useCallback(() => {
        confirmHandler().finally(() => setIsModalOpen(false));
    }, [confirmHandler]);
    return (
        <>
            <DeleteButton onPress={() => setIsModalOpen(true)}>
                <TextSemiBold20>{buttonText}</TextSemiBold20>
            </DeleteButton>
            <AreYouSureModal
                question={confirmMsg}
                closeHandler={() => setIsModalOpen(false)}
                acceptHandler={handleConfirm}
                isOpen={isModalOpen}
            />
        </>
    );
};
