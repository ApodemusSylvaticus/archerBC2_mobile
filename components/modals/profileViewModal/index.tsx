import React, { useEffect, useState } from 'react';
import { DefaultModal } from '@/components/modals/DefaultModal';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { ProfileWithId } from '@/interface/profile';
import { useProfileStore } from '@/store/useProfileStore';
import { Profile } from '@/components/profile';

export const ProfileViewModal: React.FC = () => {
    const { profileViewModalId, isProfileViewModalOpen, closeProfileViewModal } = useModalControllerStore(state => ({
        profileViewModalId: state.profileViewModalId,
        isProfileViewModalOpen: state.isProfileViewModalOpen,
        closeProfileViewModal: state.closeProfileViewModal,
    }));

    const [profile, setProfile] = useState<ProfileWithId>({
        bDiameter: 0,
        bLength: 0,
        bWeight: 0,
        bcType: 'G1',
        bulletName: '',
        cMuzzleVelocity: 0,
        cTCoeff: 0,
        cZeroAirHumidity: 0,
        cZeroAirPressure: 0,
        cZeroAirTemperature: 0,
        cZeroDistanceIdx: 0,
        cZeroPTemperature: 0,
        cZeroTemperature: 0,
        cZeroWPitch: 0,
        caliber: '',
        cartridgeName: '',
        coefCustom: [],
        coefG1: [],
        coefG7: [],
        deviceUuid: '',
        distances: [],
        profileName: '',
        rTwist: 0,
        scHeight: 0,
        shortNameBot: '',
        shortNameTop: '',
        switches: [],
        twistDir: 'left',
        userNote: '',
        zeroX: 0,
        zeroY: 0,
        id: profileViewModalId,
    });
    const profiles = useProfileStore(store => store.profiles);

    useEffect(() => {
        if (profileViewModalId) {
            const actualProfile = profiles.find(el => el.id === profileViewModalId);
            if (actualProfile) {
                setProfile(actualProfile);
                return;
            }
            throw new Error('todoError');
        }
    }, [profiles, profileViewModalId]);

    return (
        <DefaultModal backButtonHandler={closeProfileViewModal} isVisible={isProfileViewModalOpen}>
            <Profile {...profile} />
        </DefaultModal>
    );
};
