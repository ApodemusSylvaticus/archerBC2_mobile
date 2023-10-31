import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppContainer } from '@/components/container/appContainer';
import { Loader } from '@/components/loader';
import { ReticleTab } from '@/components/reticles/reticleTab';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { useReticlesStore } from '@/store/useReticlesStore';
import { CreateNewReticleFolderModal } from '@/components/modals/createNewReticleFolder';
import { DefaultButton } from '@/components/button/style';
import { Text20 } from '@/components/text/styled';
import { IDbReticle, IReticle } from '@/interface/reticles';
import { convertFromDb } from '@/helpers/reticles';
import { useSettingStore } from '@/store/useSettingStore';
import { RetryWithErrorMsg } from '@/components/retry';
import { Container } from '@/components/reticles/style';

export const ReticlesFromServer: React.FC = () => {
    const openReticlesListModal = useModalControllerStore(state => state.openReticlesListModal);
    const serverApi = useSettingStore(state => state.serverHost);
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [shouldRetry, setShouldRetry] = useState(false);
    const [isNewFolderOpen, setIsNewFolderOpen] = useState(false);

    const { setDbData, reticles } = useReticlesStore(state => ({
        setDbData: state.setDbData,
        reticles: state.reticles,
    }));
    useEffect(() => {
        setIsLoading(true);
        setErrorMsg('');
        async function fetchData() {
            try {
                const reticlesListResponse = await fetch(`http://${serverApi}:8080/getReticlesList`);
                const reticlesList: string[] = (await reticlesListResponse.json()) ?? [];

                if (reticlesList.length === 0) {
                    setDbData({ folderList: reticlesList, folders: {} });
                    return;
                }

                const promises = reticlesList.map(async el => {
                    const reticleImagesResponse = await fetch(
                        `http://${serverApi}:8080/getReticleImages?folderName=${el}`,
                    );
                    const reticleImages: IDbReticle[] = await reticleImagesResponse.json();

                    return { name: el, data: reticleImages };
                });

                const reticleData = await Promise.all(promises);

                const folders: { [folderName: string]: IReticle[] } = {};
                reticleData.forEach(el => {
                    folders[el.name] = el.data.map(({ fileName, base64Str }) => ({
                        fileName: convertFromDb(fileName),
                        base64Str,
                    }));
                });
                setDbData({ folderList: reticlesList, folders });
            } catch (e) {
                setErrorMsg('error_get_reticles_data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [serverApi]);

    useEffect(() => {
        if (!shouldRetry) {
            return;
        }
        setIsLoading(true);
        setErrorMsg('');
        setShouldRetry(false);
        async function fetchData() {
            try {
                const reticlesListResponse = await fetch(`http://${serverApi}:8080/getReticlesList`);
                const reticlesList: string[] = await reticlesListResponse.json();

                const promises = reticlesList.map(async el => {
                    const reticleImagesResponse = await fetch(
                        `http://${serverApi}:8080/getReticleImages?folderName=${el}`,
                    );
                    const reticleImages: IDbReticle[] = await reticleImagesResponse.json();

                    return { name: el, data: reticleImages };
                });

                const reticleData = await Promise.all(promises);

                const folders: { [folderName: string]: IReticle[] } = {};
                reticleData.forEach(el => {
                    folders[el.name] = el.data.map(({ fileName, base64Str }) => ({
                        fileName: convertFromDb(fileName),
                        base64Str,
                    }));
                });
                setDbData({ folderList: reticlesList, folders });
            } catch (e) {
                setErrorMsg('error_get_reticles_data');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [serverApi, shouldRetry]);

    if (isLoading) {
        return <Loader size={20} />;
    }

    if (errorMsg) {
        return <RetryWithErrorMsg retryHandler={() => setShouldRetry(true)} msg={errorMsg} />;
    }

    return (
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
    );
};

export const Reticles: React.FC = () => {
    return (
        <AppContainer>
            <ReticlesFromServer />
        </AppContainer>
    );
};

export default Reticles;
