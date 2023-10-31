import React, { useEffect, useState } from 'react';
import { Modal } from 'react-native';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DefaultModalProps } from '@/components/modals/DefaultModal';
import { GoBackButtonText } from '@/components/modals/style';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { SelectInput } from '@/components/Inputs/select/select';
import { Container, Header } from '@/components/modals/fullSizeImgViewModal/style';
import { DeleteButtonWithConfirm } from '@/components/button/deleteButtonWithConfirm';

interface FullSizeImgViewModalProps extends DefaultModalProps, IReticle {
    saveAction: (data: IReticle) => void;
    selectedList: FILE_NAMES[];
    deleteAction: () => void;
}
export const FullSizeImgViewModal: React.FC<FullSizeImgViewModalProps> = ({
    isVisible,
    backButtonHandler,
    fileName,
    saveAction,
    base64Str,
    deleteAction,
    selectedList,
}) => {
    const { top } = useSafeAreaInsets();
    const { t } = useTranslation();
    const [localState, setLocalState] = useState<IReticle>({
        base64Str,
        fileName,
    });

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
            base64Str,
            fileName,
        });
        backButtonHandler();
    };
    const handleSave = () => {
        saveAction(localState);
    };

    useEffect(() => {
        setLocalState({ base64Str, fileName });
    }, [base64Str, fileName]);

    const setFileName = (val: number) => {
        setLocalState(prev => ({ base64Str: prev.base64Str, fileName: val }));
    };
    const chooseImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
            base64: true,
        });
        if (result.canceled) {
            return;
        }

        const newBase64Str = result.assets[0].base64;
        if (!newBase64Str) {
            return;
        }
        setLocalState(prevState => ({ fileName: prevState.fileName, base64Str: newBase64Str }));
    };

    const acceptDeleteHandler = () => {
        deleteAction();
    };

    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container paddingTop={top}>
                <Header>
                    <DefaultButton onPress={goBack}>
                        <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                    </DefaultButton>

                    <DeleteButtonWithConfirm
                        confirmMsg={t('reticles_are_you_certain_delete_file')}
                        buttonText={t('default_delete')}
                        confirmHandler={acceptDeleteHandler}
                    />
                </Header>

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
                        {localState.base64Str === '' ? t('reticles_add_bmp') : t('reticles_change_bmp')}
                    </GoBackButtonText>
                </DefaultButton>

                {localState.base64Str !== '' && (
                    <GestureHandlerRootView
                        style={{
                            flex: 0.65,
                            width: '100%',
                            zIndex,
                        }}>
                        <PinchGestureHandler
                            onGestureEvent={pinchGestureHandler}
                            onActivated={() => setZIndex(5)}
                            onEnded={() => setZIndex(1)}>
                            <Animated.View style={{ flex: 1 }}>
                                <Animated.Image
                                    source={{
                                        uri: `data:image/jpeg;base64,${localState.base64Str}`,
                                    }}
                                    style={[{ flex: 1, resizeMode: 'contain' }, animatedStyle]}
                                />
                            </Animated.View>
                        </PinchGestureHandler>
                    </GestureHandlerRootView>
                )}

                {(localState.base64Str !== base64Str || localState.fileName !== fileName) && (
                    <AcceptButton onPress={handleSave}>
                        <GoBackButtonText>{t('default_save_changes')}</GoBackButtonText>
                    </AcceptButton>
                )}
            </Container>
        </Modal>
    );
};
