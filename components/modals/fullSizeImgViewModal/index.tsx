import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'styled-components/native';
import { DefaultModal, DefaultModalWithBackBtnProps, ModalHeader } from '@/components/modals/DefaultModal';
import { ContentContainer, GoBackButtonText } from '@/components/modals/style';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { SelectInput } from '@/components/Inputs/select/select';
import { DeleteButtonWithConfirm } from '@/components/button/deleteButtonWithConfirm';
import { PixelEditorModal } from '@/components/modals/pixelEditor';

interface FullSizeImgViewModalProps extends DefaultModalWithBackBtnProps, IReticle {
    saveAction: (prevState: IReticle, newState: IReticle) => void;
    selectedList: FILE_NAMES[];
    deleteAction: (filePath: string, fileName: FILE_NAMES) => void;
}
export const FullSizeImgViewModal: React.FC<FullSizeImgViewModalProps> = ({
    isVisible,
    backButtonHandler,
    fileName,
    saveAction,
    url,
    deleteAction,
    selectedList,
}) => {
    const { t } = useTranslation();
    const [localState, setLocalState] = useState<IReticle>({
        url,
        fileName,
    });

    const [isPixelEditorOpen, setIsPixelEditorOpen] = useState(false);
    const [zIndex, setZIndex] = useState(1);
    const { colors } = useTheme();
    const scale = useSharedValue(1);

    const offsetX = useSharedValue(0);
    const offsetY = useSharedValue(0);

    const initialFocalX = useSharedValue(0);
    const initialFocalY = useSharedValue(0);

    const pinchGestureHandler = useAnimatedGestureHandler({
        onStart: event => {
            initialFocalX.value = event.focalX;
            initialFocalY.value = event.focalY;
        },
        onActive: event => {
            offsetX.value = event.focalX - initialFocalX.value;
            offsetY.value = event.focalY - initialFocalY.value;

            scale.value = event.scale;
        },
        onEnd: () => {
            scale.value = withSpring(1);
            offsetX.value = withSpring(0);
            offsetY.value = withSpring(0);
        },
    });

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }, { scale: scale.value }],
        };
    });

    const goBack = () => {
        setLocalState({
            url,
            fileName,
        });
        backButtonHandler();
    };
    const handleSave = () => {
        saveAction({ url, fileName }, localState);
    };

    useEffect(() => {
        setLocalState({ url, fileName });
    }, [url, fileName]);

    const setFileName = (val: number) => {
        setLocalState(prev => ({ url: prev.url, fileName: val }));
    };
    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
        });
        if (result.canceled) {
            return;
        }

        const newUrl = result.assets[0].uri;
        if (!newUrl) {
            return;
        }
        setLocalState(prevState => ({ fileName: prevState.fileName, url: newUrl }));
    };

    const acceptDeleteHandler = async () => {
        deleteAction(url, fileName);
    };

    return (
        <DefaultModal isVisible={isVisible}>
            <ModalHeader>
                <DefaultButton onPress={goBack}>
                    <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                </DefaultButton>

                <DeleteButtonWithConfirm
                    confirmMsg={t('reticles_are_you_certain_delete_file')}
                    buttonText={t('default_delete')}
                    confirmHandler={acceptDeleteHandler}
                />
            </ModalHeader>

            <ContentContainer>
                <SelectInput
                    label={t('reticles_set_zoom')}
                    list={['x1', 'x2', 'x3', 'x4', 'x6']}
                    background={colors.appBg}
                    setElem={setFileName}
                    baseValue={fileName}
                    chosenEl={localState.fileName}
                    zIndex={2}
                    alreadyExistArr={selectedList}
                />

                <DefaultButton onPress={chooseImage}>
                    <GoBackButtonText>
                        {localState.url === '' ? t('reticles_add_bmp') : t('reticles_change_bmp')}
                    </GoBackButtonText>
                </DefaultButton>

                {localState.url !== '' && (
                    <GestureHandlerRootView
                        style={{
                            flex: 0.45,
                            width: '100%',
                            zIndex,
                        }}>
                        <PinchGestureHandler
                            onGestureEvent={pinchGestureHandler}
                            onActivated={() => setZIndex(5)}
                            onEnded={() => setZIndex(1)}>
                            <Animated.View style={{ flex: 1 }}>
                                <Animated.Image
                                    key={Math.random()}
                                    source={{
                                        uri: localState.url,
                                        cache: 'reload',
                                        headers: {
                                            Pragma: 'no-cache',
                                        },
                                    }}
                                    style={[{ flex: 1, resizeMode: 'contain' }, animatedStyle]}
                                />
                            </Animated.View>
                        </PinchGestureHandler>
                    </GestureHandlerRootView>
                )}

                {localState.url !== '' && (
                    <>
                        <PixelEditorModal
                            setNewImg={data => {
                                setLocalState(prevState => ({ fileName: prevState.fileName, url: data }));
                                setIsPixelEditorOpen(false);
                            }}
                            backButtonHandler={() => setIsPixelEditorOpen(false)}
                            isVisible={isPixelEditorOpen}
                            image={localState.url}
                        />
                        <DefaultButton onPress={() => setIsPixelEditorOpen(true)}>
                            <GoBackButtonText>{t('reticles_pixel_editor')}</GoBackButtonText>
                        </DefaultButton>
                    </>
                )}

                {(localState.url !== url || localState.fileName !== fileName) && (
                    <AcceptButton onPress={handleSave}>
                        <GoBackButtonText>{t('default_save_changes')}</GoBackButtonText>
                    </AcceptButton>
                )}
            </ContentContainer>
        </DefaultModal>
    );
};
