import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import * as ImagePicker from 'expo-image-picker';
import { Modal, View } from 'react-native';
import { GestureHandlerRootView, PinchGestureHandler } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoBackButtonText } from '@/components/modals/style';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { SelectInput } from '@/components/Inputs/select/select';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { DefaultModalProps } from '@/components/modals/DefaultModal';
import { Container } from '@/components/modals/fullSizeImgViewModal/style';
import { findSmallestMissingValue } from '@/helpers/findSmallestMissingValue';

interface CreateNewReticleFileModalProps extends DefaultModalProps {
    saveAction: (data: IReticle) => void;
    selectedList: FILE_NAMES[];
}

export const CreateNewReticleFileModal: React.FC<CreateNewReticleFileModalProps> = ({
    isVisible,
    backButtonHandler,
    saveAction,
    selectedList,
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const { top } = useSafeAreaInsets();
    const [localState, setLocalState] = useState<IReticle>({
        base64Str: '',
        fileName: findSmallestMissingValue(selectedList),
    });

    useEffect(() => {
        setLocalState({ base64Str: '', fileName: findSmallestMissingValue(selectedList) });
    }, [selectedList]);
    const scale = useSharedValue(1);
    const [zIndex, setZIndex] = useState(1);

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

            // Устанавливаем масштаб
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

        const base64Str = result.assets[0].base64;
        if (!base64Str) {
            throw new Error('Cannot convert img to base64');
        }

        setLocalState(prevState => ({ base64Str, fileName: prevState.fileName }));
    };

    const setFileName = (val: number) => {
        setLocalState(prev => ({ base64Str: prev.base64Str, fileName: val }));
    };

    const createNew = () => {
        saveAction(localState);
        backButtonHandler();
    };

    return (
        <Modal animationType="slide" visible={isVisible}>
            <Container paddingTop={top}>
                <View style={{ display: 'flex', flexDirection: 'row', marginBottom: 16 }}>
                    <DefaultButton onPress={backButtonHandler}>
                        <GoBackButtonText>{t('default_go_back')}</GoBackButtonText>
                    </DefaultButton>
                </View>

                <SelectInput
                    label={t('reticles_set_zoom')}
                    list={['x1', 'x2', 'x3', 'x4', 'x6']}
                    background={colors.appBg}
                    setElem={setFileName}
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
                    <GestureHandlerRootView style={{ flex: 0.65, width: '100%', zIndex }}>
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

                {localState.base64Str !== '' && (
                    <AcceptButton onPress={createNew}>
                        <GoBackButtonText>{t('default_save')}</GoBackButtonText>
                    </AcceptButton>
                )}
            </Container>
        </Modal>
    );
};
