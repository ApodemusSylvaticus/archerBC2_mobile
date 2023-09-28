import { create } from 'zustand';
import { Nullable } from '@/interface/helper';

interface IModalsController {
    isNewProfileOpen: boolean;
    openNewProfileModal: () => void;
    closeNewProfileModal: () => void;
    isProfileViewModalOpen: boolean;
    profileViewModalFileName: Nullable<string>;
    setProfileViewModalFileName: (fileName: string) => void;
    openProfileViewModal: (fileName: string) => void;
    closeProfileViewModal: () => void;

    isDistanceListOpen: boolean;
    distanceListFileName: string;
    openDistanceList: (fileName: string) => void;
    closeDistanceList: () => void;

    isChooseActiveProfileOpen: boolean;
    openChooseActiveProfileModal: () => void;
    closeChooseActiveProfileModal: () => void;
}

export const useModalControllerStore = create<IModalsController>()(set => ({
    isNewProfileOpen: false,
    openNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: true })),
    closeNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: false })),
    isProfileViewModalOpen: false,
    profileViewModalFileName: null,
    setProfileViewModalFileName: fileName => set({ profileViewModalFileName: fileName }),
    openProfileViewModal: fileName => set({ profileViewModalFileName: fileName, isProfileViewModalOpen: true }),
    closeProfileViewModal: () => set({ profileViewModalFileName: null, isProfileViewModalOpen: false }),

    isChooseActiveProfileOpen: false,
    openChooseActiveProfileModal: () => set({ isChooseActiveProfileOpen: true }),
    closeChooseActiveProfileModal: () => set({ isChooseActiveProfileOpen: false }),

    isDistanceListOpen: false,
    distanceListFileName: '',
    openDistanceList: fileName => set({ distanceListFileName: fileName, isDistanceListOpen: true }),
    closeDistanceList: () => set({ distanceListFileName: '', isDistanceListOpen: false }),
}));
