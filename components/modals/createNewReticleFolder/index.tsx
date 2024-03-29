import { useTheme } from 'styled-components/native';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultModalWithBackBtn, DefaultModalWithBackBtnProps } from '@/components/modals/DefaultModal';
import { DefaultInput } from '@/components/Inputs/defaultInput';
import { DefaultRow } from '@/components/container/defaultBox';
import { AcceptButton, DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';
import { ReticleTab } from '../../reticles/reticleTab';
import { FullSizeImgViewModal } from '../fullSizeImgViewModal';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { CreateNewReticleFileModal } from '@/components/modals/fullSizeImgViewModal/createNewReticleFile';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { useReticlesStore } from '@/store/useReticlesStore';
import { convertFromFileNameToString } from '@/helpers/reticles';
import { ErrorText } from '@/components/modals/createNewReticleFolder/style';
import { ReticlesCore } from '@/core/reticlesCore';
import { useCheckWiFiStatus } from '@/hooks/useCheckWiFiStatus';

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

    const checkWifi = useCheckWiFiStatus();

    const reticlesCore = useMemo(() => new ReticlesCore(), []);

    const { addNewFolder, existReticles } = useReticlesStore(retStore => ({
        addNewFolder: retStore.addNewFolder,
        existReticles: retStore.reticles,
    }));

    const [fileNameError, setFileNameError] = useState('');

    const sendNotification = useNotificationStore(notificationStore => notificationStore.sendNotification);

    const [fullSizeModalState, setFullSizeModalState] = useState({
        isOpen: false,
        url: '',
        fileName: FILE_NAMES.FIRST,
    });

    const addNewFile = (data: IReticle) => {
        setState(prevState => ({
            ...prevState,
            list: [...prevState.list, { fileName: data.fileName, url: data.url }],
        }));
    };

    const openModalNewFile = () => {
        setIsNewFileOpen(true);
    };

    const closeModalNewFile = () => {
        setIsNewFileOpen(false);
    };

    const openFullSizeModal = (data: IReticle) => {
        setFullSizeModalState({ isOpen: true, fileName: data.fileName, url: data.url });
    };

    const closeFullSizeModal = () => {
        setFullSizeModalState({ isOpen: false, fileName: 0, url: '' });
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
        if (!checkWifi()) {
            return;
        }
        reticlesCore
            .createNewReticleFolder(state.folderName, state.list)
            .then(newReticles => {
                sendNotification({ type: NotificationEnum.SUCCESS, msg: t('reticles_folder_created') });
                addNewFolder({ newReticles, folderName: state.folderName });

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
    // TODOOOOO CHECK
    const saveActionFullSize = async (data: IReticle) => {
        setState(prev => {
            if (fullSizeModalState.fileName === data.fileName) {
                return {
                    folderName: prev.folderName,
                    list: prev.list.map(el => ({
                        fileName: el.fileName,
                        url: el.fileName === data.fileName ? data.url : el.url,
                    })),
                };
            }
            const include = !!prev.list.find(el => el.fileName === data.fileName);
            if (include) {
                return {
                    folderName: prev.folderName,
                    list: prev.list
                        .filter(el => el.fileName !== fullSizeModalState.fileName)
                        .map(el => (el.fileName === data.fileName ? { fileName: data.fileName, url: data.url } : el)),
                };
            }
            return {
                folderName: prev.folderName,
                list: prev.list.map(el =>
                    el.fileName === fullSizeModalState.fileName ? { fileName: data.fileName, url: data.url } : el,
                ),
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
                    onPress={() => openFullSizeModal({ fileName: el.fileName, url: el.url })}
                    key={`${state.folderName}_${el.fileName}`}
                    bmpImageUrl={el.url}
                />
            ))}

            {state.list.length < 5 && (
                <DefaultButton onPress={openModalNewFile}>
                    <TextSemiBold20>{t('reticles_add_reticle')}</TextSemiBold20>
                </DefaultButton>
            )}

            {!isDisabled && (
                <AcceptButton onPress={sendImageToServer}>
                    <TextSemiBold20>{t('default_save')}</TextSemiBold20>
                </AcceptButton>
            )}

            <FullSizeImgViewModal
                selectedList={state.list.map(el => el.fileName)}
                isVisible={fullSizeModalState.isOpen}
                backButtonHandler={closeFullSizeModal}
                saveAction={saveActionFullSize}
                deleteAction={deleteAction}
                fileName={fullSizeModalState.fileName}
                url={fullSizeModalState.url}
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
