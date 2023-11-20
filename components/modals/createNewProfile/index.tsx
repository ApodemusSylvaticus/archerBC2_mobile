import React, { useEffect, useState } from 'react';
import { DescriptionForm } from '@/components/forms/newProfile/descriptionForm';
import { NewRiffleForm } from '@/components/forms/riffleForm';
import { NewCartridgeForm } from '@/components/forms/cartridgeForm';
import { BulletForm } from '@/components/forms/newProfile/bulletForm';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { BallisticProfileForm } from '@/components/forms/newProfile/ballisticProfileForm';
import { CoefficientForm } from '@/components/forms/newProfile/coefficientForm';
import { useConvertProfile } from '@/hooks/useConvertProfile';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { DefaultModalWithBackBtn } from '@/components/modals/DefaultModal';
import { FileNameForm } from '@/components/forms/newProfile/fileNameForm';

export const CreateNewProfileModal: React.FC = () => {
    const [page, setPage] = useState<number>(0);

    const convertProfile = useConvertProfile();
    const { isNewProfileOpen, closeNewProfileModal } = useModalControllerStore(state => ({
        isNewProfileOpen: state.isNewProfileOpen,
        closeNewProfileModal: state.closeNewProfileModal,
    }));
    const reset = useNewProfileStore(state => state.reset);
    const [isFinished, setIsFinished] = useState(false);
    const [shouldClose, setShouldClose] = useState(false);

    const goBack = () => setPage(prevState => (prevState !== 0 ? prevState - 1 : prevState));
    const goForward = async () => {
        if (page === 6) {
            setIsFinished(true);
            return;
        }
        setPage(prevState => prevState + 1);
    };

    useEffect(() => {
        if (isFinished) {
            setIsFinished(false);
            convertProfile();
            setShouldClose(true);
        }
    }, [isFinished]);

    useEffect(() => {
        if (shouldClose) {
            setShouldClose(false);
            reset();
            setPage(0);
            closeNewProfileModal();
        }
    }, [reset, closeNewProfileModal, shouldClose]);

    return (
        <DefaultModalWithBackBtn backButtonHandler={() => setShouldClose(true)} isVisible={isNewProfileOpen}>
            {page === 0 && <NewRiffleForm goBack={goBack} goForward={goForward} />}
            {page === 1 && <NewCartridgeForm goBack={goBack} goForward={goForward} />}
            {page === 2 && <BulletForm goBack={goBack} goForward={goForward} />}
            {page === 3 && <BallisticProfileForm goBack={goBack} goForward={goForward} />}
            {page === 4 && <CoefficientForm goBack={goBack} goForward={goForward} />}
            {page === 5 && <DescriptionForm goBack={goBack} goForward={goForward} />}

            {page === 6 && <FileNameForm goBack={goBack} goForward={goForward} />}
        </DefaultModalWithBackBtn>
    );
};
