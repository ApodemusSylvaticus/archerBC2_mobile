import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { DefaultModal } from '@/components/modals/DefaultModal';
import { ReticleTab } from '../../reticles/reticleTab';
import { FullSizeImgViewModal } from '../fullSizeImgViewModal';
import { useReticlesStore } from '@/store/useReticlesStore';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { convertFromFileNameToString, convertToDB } from '@/helpers/reticles';
import { NotificationEnum, useNotificationStore } from '@/store/useNotificationStore';
import { DefaultButton, DeleteButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { CreateNewReticleFileModal } from '@/components/modals/fullSizeImgViewModal/createNewReticleFile';
import { AreYouSureModal } from '@/components/modals/specificModal/alertModal/areYouSure';
import { useSettingStore } from '@/store/useSettingStore';

export const ReticlesListModal: React.FC = () => {
    const serverApi = useSettingStore(state => state.serverHost);
    const { t } = useTranslation();
    const { close, reticlesFolderName } = useModalControllerStore(state => ({
        close: state.closeReticlesListModal,
        reticlesFolderName: state.reticlesFolderName,
    }));
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

    const [fullSizeState, setFullSizeState] = useState({
        isVisible: false,
        base64Str: '',
        fileName: FILE_NAMES.FIRST,
    });

    const openViewImgModal = (base64Str: string, fileName: FILE_NAMES) => {
        setFullSizeState({ isVisible: true, base64Str, fileName });
    };

    const backButtonHandler = () => {
        setFullSizeState({ isVisible: false, base64Str: '', fileName: FILE_NAMES.FIRST });
    };

    const saveAction = (data: IReticle) => {
        fetch(`http://${serverApi}:8080/replaceFile?folderName=${reticlesFolderName}`, {
            method: 'POST',
            body: JSON.stringify({
                originalFileName: convertToDB(fullSizeState.fileName),
                originalBase64Str: fullSizeState.base64Str,
                newFileName: convertToDB(data.fileName),
                newBase64Str: data.base64Str,
            }),
        })
            .then(() => {
                changeFile({
                    prevState: { fileName: fullSizeState.fileName, base64Str: fullSizeState.base64Str },
                    newState: data,
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
    };

    const deleteAction = () => {
        fetch(`http://${serverApi}:8080/deleteReticle?folderName=${reticlesFolderName}`, {
            method: 'POST',
            body: JSON.stringify([convertToDB(fullSizeState.fileName)]),
        })
            .then(() => {
                deleteFile({ folderName: reticlesFolderName, fileName: fullSizeState.fileName });
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
                    base64Str: '',
                    fileName: FILE_NAMES.FIRST,
                });
            });
    };

    const saveActionCNRF = (data: IReticle) => {
        fetch(`http://${serverApi}:8080/uploadReticleImages?folderName=${reticlesFolderName}`, {
            method: 'POST',
            body: JSON.stringify([
                {
                    fileName: convertToDB(data.fileName),
                    base64Str: data.base64Str,
                },
            ]),
        })
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
    };

    const deleteFolderHandler = () => {
        fetch(`http://${serverApi}:8080/deleteReticleFolder?folderName=${reticlesFolderName}`, {
            method: 'DELETE',
        })
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
    };

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
        <DefaultModal backButtonHandler={close} isVisible>
            {reticles.folders[reticlesFolderName].map(el => (
                <ReticleTab
                    name={convertFromFileNameToString(el.fileName)}
                    onPress={() => openViewImgModal(el.base64Str, el.fileName)}
                    key={`${reticlesFolderName}_${el.fileName}`}
                    bmpImage={el.base64Str}
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
                saveAction={saveActionCNRF}
                selectedList={reticles.folders[reticlesFolderName].map(el => el.fileName)}
                backButtonHandler={() => setIsCreateNewFileOpen(false)}
                isVisible={isCreateNewFileOpen}
            />
            <FullSizeImgViewModal
                saveAction={saveAction}
                selectedList={reticles.folders[reticlesFolderName].map(el => el.fileName)}
                deleteAction={deleteAction}
                base64Str={fullSizeState.base64Str}
                fileName={fullSizeState.fileName}
                isVisible={fullSizeState.isVisible}
                backButtonHandler={backButtonHandler}
            />
        </DefaultModal>
    );
};
