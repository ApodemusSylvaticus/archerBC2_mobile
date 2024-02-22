import React, { useCallback } from 'react';
import { useImage } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { DefaultModal, ModalHeader } from '@/components/modals/DefaultModal';
import { GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { Editor } from '@/components/modals/pixelEditor/editor';
import { PixelEditorModalProps } from '@/interface/components/pixelEditor';

export const PixelEditorModal: React.FC<PixelEditorModalProps> = ({
    isVisible,
    backButtonHandler,
    image,
    setNewImg,
}) => {
    /*
    const img = Skia.Image.MakeImageFromEncoded(Skia.Data.fromBase64(image));
*/

    const img = useImage(image);
    const { t } = useTranslation();

    const goBack = useCallback(() => {
        backButtonHandler();
    }, [backButtonHandler]);

    return (
        <DefaultModal isVisible={isVisible}>
            <ModalHeader>
                <GoBackButton onPress={goBack}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>
            </ModalHeader>

            {img && <Editor img={img} setNewImg={setNewImg} />}
        </DefaultModal>
    );
};
