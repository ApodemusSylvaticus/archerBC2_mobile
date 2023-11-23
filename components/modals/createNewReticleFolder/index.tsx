import { useTheme } from 'styled-components/native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultModalWithBackBtn, DefaultModalWithBackBtnProps } from '@/components/modals/DefaultModal';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { DefaultRow } from '@/components/container/defaultBox';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { ReticleTab } from '../../reticles/reticleTab';
import { FullSizeImgViewModal } from '../fullSizeImgViewModal';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { CreateNewReticleFileModal } from '@/components/modals/fullSizeImgViewModal/createNewReticleFile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { useReticlesStore } from '@/store/useReticlesStore';
import { convertFromFileNameToString } from '@/helpers/reticles';
import { ErrorText } from '@/components/modals/createNewReticleFolder/style';
import { ReticlesCore } from '@/core/reticlesCore';

export const CreateNewReticleFolderModal: React.FC<DefaultModalWithBackBtnProps> = ({
    backButtonHandler,
    isVisible,
}) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const [isNewFileOpen, setIsNewFileOpen] = useState(false);
    const [state, setState] = useState<{ folderName: string; list: IReticle[] }>({
        folderName: '',
        list: [],
    });

    const reticlesCore = useMemo(() => new ReticlesCore(), []);

    const { addNewFolder, existReticles } = useReticlesStore(retStore => ({
        addNewFolder: retStore.addNewFolder,
        existReticles: retStore.reticles,
    }));

    const [fileNameError, setFileNameError] = useState('');

    const sendNotification = useNotificationStore(notificationStore => notificationStore.sendNotification);

    const [fullSizeModalState, setFullSizeModalState] = useState({
        isOpen: false,
        base64Str: '',
        fileName: FILE_NAMES.FIRST,
    });

    const addNewFile = (data: IReticle) => {
        setState(prevState => ({
            ...prevState,
            list: [...prevState.list, { fileName: data.fileName, base64Str: data.base64Str }],
        }));
    };

    const openModalNewFile = () => {
        setIsNewFileOpen(true);
    };

    const closeModalNewFile = () => {
        setIsNewFileOpen(false);
    };

    const openFullSizeModal = (data: IReticle) => {
        setFullSizeModalState({ isOpen: true, fileName: data.fileName, base64Str: data.base64Str });
    };

    const closeFullSizeModal = () => {
        setFullSizeModalState({ isOpen: false, fileName: 0, base64Str: '' });
    };
    const deleteAction = () => {
        setState(prevState => ({
            list: prevState.list.filter(el => el.fileName !== fullSizeModalState.fileName),
            folderName: prevState.folderName,
        }));
        closeFullSizeModal();
    };

    const handleBackButtonHandler = () => {
        setState({ list: [], folderName: '' });
        backButtonHandler();
    };

    const sendImageToServer = () => {
        reticlesCore
            .sendFolderToServer(state.folderName, state.list)
            .then(() => {
                sendNotification({ type: NotificationEnum.SUCCESS, msg: t('reticles_folder_created') });
                addNewFolder({ newReticles: state.list, folderName: state.folderName });

                handleBackButtonHandler();
            })
            .catch(error => {
                sendNotification({ type: NotificationEnum.ERROR, msg: t('reticles_failed_create_folder') });
                console.error('Error:', error);
            });
    };

    const setFolderName = (data: string) => {
        const regex = /^[a-zA-Z0-9][a-zA-Z0-9_.\- ]*$/;

        setState(prev => ({ list: prev.list, folderName: data }));

        if (!regex.test(data)) {
            setFileNameError(t('reticles_invalid_input_file'));
            return;
        }

        if (existReticles.folderList.includes(data)) {
            setFileNameError(t('reticles_folder_already_exist'));
            return;
        }
        setFileNameError('');
    };

    const saveActionFullSize = (data: IReticle) => {
        setState(prev => {
            if (fullSizeModalState.fileName === data.fileName) {
                return {
                    folderName: prev.folderName,
                    list: prev.list.map(el => ({
                        fileName: el.fileName,
                        base64Str: el.fileName === data.fileName ? data.base64Str : el.base64Str,
                    })),
                };
            }
            const include = !!prev.list.find(el => el.fileName === data.fileName);
            if (include) {
                return {
                    folderName: prev.folderName,
                    list: prev.list
                        .filter(el => el.fileName !== fullSizeModalState.fileName)
                        .map(el => (el.fileName === data.fileName ? data : el)),
                };
            }
            return {
                folderName: prev.folderName,
                list: prev.list.map(el => (el.fileName === fullSizeModalState.fileName ? data : el)),
            };
        });
        closeFullSizeModal();
    };

    const isDisabled = fileNameError.length !== 0 || state.list.length === 0 || state.folderName === '';
    return (
        <DefaultModalWithBackBtn isVisible={isVisible} backButtonHandler={handleBackButtonHandler}>
            <DefaultRow>
                <DefaultInput
                    value={state.folderName}
                    onChangeText={setFolderName}
                    label={t('reticles_enter_folder_name')}
                    onBlur={() => undefined}
                    background={colors.appBg}
                />
            </DefaultRow>

            {fileNameError.length > 0 && <ErrorText>{fileNameError}</ErrorText>}

            {state.list.map(el => (
                <ReticleTab
                    name={convertFromFileNameToString(el.fileName)}
                    onPress={() => openFullSizeModal({ fileName: el.fileName, base64Str: el.base64Str })}
                    key={`${state.folderName}_${el.fileName}`}
                    bmpImage={el.base64Str}
                />
            ))}

            {state.list.length < 5 && (
                <DefaultButton onPress={openModalNewFile}>
                    <Text20>{t('reticles_create_new_reticle')}</Text20>
                </DefaultButton>
            )}

            {!isDisabled && (
                <AcceptButton onPress={sendImageToServer}>
                    <Text20>{t('default_save')}</Text20>
                </AcceptButton>
            )}

            <FullSizeImgViewModal
                selectedList={state.list.map(el => el.fileName)}
                isVisible={fullSizeModalState.isOpen}
                backButtonHandler={closeFullSizeModal}
                saveAction={saveActionFullSize}
                deleteAction={deleteAction}
                fileName={fullSizeModalState.fileName}
                base64Str={fullSizeModalState.base64Str}
            />

            <CreateNewReticleFileModal
                saveAction={addNewFile}
                isVisible={isNewFileOpen}
                selectedList={state.list.map(el => el.fileName)}
                backButtonHandler={closeModalNewFile}
            />
        </DefaultModalWithBackBtn>
    );
};
