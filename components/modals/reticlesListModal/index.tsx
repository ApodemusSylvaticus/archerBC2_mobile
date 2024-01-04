import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { DefaultModalWithBackBtn } from '@/components/modals/DefaultModal';
import { ReticleTab } from '../../reticles/reticleTab';
import { FullSizeImgViewModal } from '../fullSizeImgViewModal';
import { useReticlesStore } from '@/store/useReticlesStore';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { convertFromFileNameToString } from '@/helpers/reticles';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { DefaultButton, DeleteButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { CreateNewReticleFileModal } from '@/components/modals/fullSizeImgViewModal/createNewReticleFile';
import { AreYouSureModal } from '@/components/modals/specificModal/alertModal/areYouSure';
import { ReticlesCoreV2 } from '@/core/reticlesCore';
import { useCheckWiFiStatus } from '@/hooks/useCheckWiFiStatus';

export const ReticlesListModal: React.FC = () => {
    const { t } = useTranslation();
    const { close, reticlesFolderName } = useModalControllerStore(state => ({
        close: state.closeReticlesListModal,
        reticlesFolderName: state.reticlesFolderName,
    }));
    const checkWifi = useCheckWiFiStatus();
    const [isCreateNewFileOpen, setIsCreateNewFileOpen] = useState(false);
    const sendNotification = useNotificationStore(state => state.sendNotification);
    const [areUreUSureDeleteFolder, setAreUSureDeleteFolder] = useState(false);

    const { reticles, changeFile, deleteFile, addNewFile, deleteFolder } = useReticlesStore(state => ({
        reticles: state.reticles,
        changeFile: state.changeFile,
        deleteFile: state.deleteFile,
        addNewFile: state.addNewFile,
        deleteFolder: state.deleteFolder,
    }));

    const reticlesCore = useMemo(() => new ReticlesCoreV2(), []);

    const [fullSizeState, setFullSizeState] = useState({
        isVisible: false,
        url: '',
        fileName: FILE_NAMES.FIRST,
    });
    const deleteAction = useCallback(
        (filePath: string, fileName: FILE_NAMES) => {
            if (!checkWifi()) {
                return;
            }
            reticlesCore
                .deleteReticle(reticlesFolderName, filePath)
                .then(() => {
                    deleteFile({ folderName: reticlesFolderName, fileName });
                    sendNotification({ type: NotificationEnum.SUCCESS, msg: t('default_file_deleted') });
                })
                .catch(reason => {
                    sendNotification({
                        type: NotificationEnum.ERROR,
                        msg: reason.msg ?? reason.data ?? t('default_smth_went_wrong'),
                    });
                })
                .finally(() => {
                    setFullSizeState({
                        isVisible: false,
                        url: '',
                        fileName: FILE_NAMES.FIRST,
                    });
                });
        },
        [checkWifi, deleteFile, reticlesCore, reticlesFolderName, sendNotification, t],
    );

    const openViewImgModal = (url: string, fileName: FILE_NAMES) => {
        setFullSizeState({ isVisible: true, url, fileName });
    };

    const backButtonHandler = () => {
        setFullSizeState({ isVisible: false, url: '', fileName: FILE_NAMES.FIRST });
    };

    const saveAction = useCallback(
        (prevState: IReticle, newState: IReticle) => {
            if (!checkWifi()) {
                return;
            }
            reticlesCore
                .replaceReticles(reticlesFolderName, prevState, newState)
                .then(() => {
                    changeFile({
                        prevState,
                        newState,
                        folderName: reticlesFolderName,
                    });
                    sendNotification({ type: NotificationEnum.SUCCESS, msg: t('default_files_changed') });
                })
                .catch(reason => {
                    sendNotification({
                        type: NotificationEnum.ERROR,
                        msg: reason.msg ?? reason.data ?? t('default_smth_went_wrong'),
                    });
                })
                .finally(() => {
                    backButtonHandler();
                });
        },
        [changeFile, checkWifi, reticlesCore, reticlesFolderName, sendNotification, t],
    );

    const saveActionCreateNewReticalFile = useCallback(
        (data: IReticle) => {
            if (!checkWifi()) {
                return;
            }
            reticlesCore
                .saveActionCreateNewReticalFile(reticlesFolderName, data)
                .then(() => {
                    addNewFile({ folderName: reticlesFolderName, reticle: data });
                    sendNotification({ type: NotificationEnum.SUCCESS, msg: t('default_file_added') });
                })
                .catch(reason => {
                    sendNotification({
                        type: NotificationEnum.ERROR,
                        msg: reason.msg ?? reason.data ?? t('default_smth_went_wrong'),
                    });
                })
                .finally(() => {
                    backButtonHandler();
                });
        },
        [addNewFile, checkWifi, reticlesCore, reticlesFolderName, sendNotification, t],
    );
    const deleteFolderHandler = useCallback(() => {
        if (!checkWifi()) {
            return;
        }
        reticlesCore
            .deleteReticleByFolderName(reticlesFolderName)
            .then(() => {
                close();
                deleteFolder(reticlesFolderName);
                sendNotification({ type: NotificationEnum.SUCCESS, msg: t('reticles_folder_deleted') });
            })
            .catch(reason => {
                sendNotification({
                    type: NotificationEnum.ERROR,
                    msg: reason.msg ?? reason.data ?? t('default_smth_went_wrong'),
                });
            })
            .finally(() => setAreUSureDeleteFolder(false));
    }, [checkWifi, close, deleteFolder, reticlesCore, reticlesFolderName, sendNotification, t]);

    useEffect(() => {
        if (!reticles.folders[reticlesFolderName]) {
            close();
        }
    }, [close, reticles.folders, reticlesFolderName]);

    if (reticlesFolderName === '' || !reticles.folders[reticlesFolderName]) {
        return;
    }

    // eslint-disable-next-line consistent-return
    return (
        <DefaultModalWithBackBtn backButtonHandler={close} isVisible>
            {reticles.folders[reticlesFolderName].map(el => (
                <ReticleTab
                    name={convertFromFileNameToString(el.fileName)}
                    onPress={() => openViewImgModal(el.url, el.fileName)}
                    key={`${reticlesFolderName}_${el.fileName}`}
                    bmpImageUrl={el.url}
                />
            ))}

            {reticles.folders[reticlesFolderName].length < 5 && (
                <DefaultButton onPress={() => setIsCreateNewFileOpen(true)}>
                    <Text20>{t('reticles_add_reticle')}</Text20>
                </DefaultButton>
            )}

            <DeleteButton onPress={() => setAreUSureDeleteFolder(true)}>
                <Text20>{t('reticles_delete_folder')}</Text20>
            </DeleteButton>

            <AreYouSureModal
                question={t('reticles_are_you_certain_delete_folder')}
                isOpen={areUreUSureDeleteFolder}
                acceptHandler={deleteFolderHandler}
                closeHandler={() => setAreUSureDeleteFolder(false)}
            />

            <CreateNewReticleFileModal
                saveAction={saveActionCreateNewReticalFile}
                selectedList={reticles.folders[reticlesFolderName].map(el => el.fileName)}
                backButtonHandler={() => setIsCreateNewFileOpen(false)}
                isVisible={isCreateNewFileOpen}
            />
            <FullSizeImgViewModal
                saveAction={saveAction}
                selectedList={reticles.folders[reticlesFolderName].map(el => el.fileName)}
                deleteAction={deleteAction}
                url={fullSizeState.url}
                fileName={fullSizeState.fileName}
                isVisible={fullSizeState.isVisible}
                backButtonHandler={backButtonHandler}
            />
        </DefaultModalWithBackBtn>
    );
};
