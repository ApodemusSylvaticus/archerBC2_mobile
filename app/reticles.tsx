import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContainer } from '@/components/container/appContainer';
import { Loader } from '@/components/loader';
import { ReticleTab } from '@/components/reticles/reticleTab';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { useReticlesStore } from '@/store/useReticlesStore';
import { CreateNewReticleFolderModal } from '@/components/modals/createNewReticleFolder';
import { DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { useSettingStore } from '@/store/useSettingStore';
import { RetryWithErrorMsg } from '@/components/retry';
import { Container } from '@/components/reticles/style';
import { ReticlesCore } from '@/core/reticlesCore';

export const Reticles: React.FC = () => {
    const openReticlesListModal = useModalControllerStore(state => state.openReticlesListModal);
    const serverApi = useSettingStore(state => state.serverHost);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [shouldRetry, setShouldRetry] = useState(false);
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);
    const reticleCore = useMemo(() => new ReticlesCore(), []);

    const { setDbData, reticles } = useReticlesStore(state => ({
        setDbData: state.setDbData,
        reticles: state.reticles,
    }));

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setErrorMsg('');

        try {
            const list = await reticleCore.getReticleList();
            if (list.length === 0) {
                setDbData({ folderList: list, folders: {} });
                return;
            }

            const folders = await reticleCore.getReticleListImg(list);
            setDbData({ folderList: list, folders });
        } catch (e) {
            setErrorMsg(t('error_get_reticles_data'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (reticleCore.getServerApi() !== serverApi) {
            reticleCore.setHrefBase(serverApi);

            fetchData();
            return;
        }

        if (reticles.folderList.length === 0) {
            fetchData();
        }
    }, [reticles.folderList, serverApi]);

    useEffect(() => {
        if (shouldRetry === false) {
            return;
        }

        setShouldRetry(false);

        fetchData();
    }, [shouldRetry]);

    if (isLoading) {
        return (
            <AppContainer>
                <Loader size={20} />
            </AppContainer>
        );
    }

    if (errorMsg) {
        return (
            <AppContainer>
                <RetryWithErrorMsg retryHandler={() => setShouldRetry(true)} msg={errorMsg} />
            </AppContainer>
        );
    }
    return (
        <AppContainer refreshFunc={() => setShouldRetry(true)}>
            <Container>
                {reticles.folderList.map(el => (
                    <ReticleTab
                        name={el}
                        onPress={() => openReticlesListModal(el)}
                        key={el}
                        bmpImage={reticles.folders[el][0].base64Str}
                    />
                ))}

                {reticles.folderList.length < 5 && (
                    <DefaultButton onPress={() => setIsNewFolderOpen(true)}>
                        <Text20>{t('reticles_create_new_folder')}</Text20>
                    </DefaultButton>
                )}

                <CreateNewReticleFolderModal
                    isVisible={isNewFolderOpen}
                    backButtonHandler={() => setIsNewFolderOpen(false)}
                />
            </Container>
        </AppContainer>
    );
};

export default Reticles;
