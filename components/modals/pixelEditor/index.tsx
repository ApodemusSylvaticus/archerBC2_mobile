import React, { useCallback, useState } from 'react';
import { Skia, SkImage } from '@shopify/react-native-skia';
import { useTranslation } from 'react-i18next';
import { DefaultModal, ModalHeader } from '@/components/modals/DefaultModal';
import { Nullable } from '@/interface/helper';
import { GoBackButton, GoBackButtonText } from '@/components/modals/style';
import { SetCenterComponent } from '@/components/modals/pixelEditor/setCenter';
import { Editor } from '@/components/modals/pixelEditor/editor';
import { PixelEditorModalProps } from '@/interface/components/pixelEditor';

export const PixelEditorModal: React.FC<PixelEditorModalProps> = ({
    isVisible,
    backButtonHandler,
    image,
    setNewImg,
}) => {
    const img = Skia.Image.MakeImageFromEncoded(Skia.Data.fromBase64(image));

    const { t } = useTranslation();
    const [stage, setStage] = useState(0);
    const [readyToChangeImg, setReadyToChangeImg] = useState<Nullable<SkImage>>(null);

    const centerSelectedAction = useCallback((data: SkImage) => {
        setStage(1);
        setReadyToChangeImg(data);
    }, []);

    const goBack = useCallback(() => {
        if (stage === 1) {
            setStage(0);
            setReadyToChangeImg(null);
            return;
        }
        backButtonHandler();
    }, [stage, backButtonHandler]);

    return (
        <DefaultModal isVisible={isVisible}>
            <ModalHeader>
                <GoBackButton onPress={goBack}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </GoBackButton>
            </ModalHeader>
            {img && stage === 0 && <SetCenterComponent img={img} centerSelectedAction={centerSelectedAction} />}
            {readyToChangeImg && stage === 1 && <Editor img={readyToChangeImg} setNewImg={setNewImg} />}
        </DefaultModal>
    );
};
