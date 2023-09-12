import { create } from 'zustand';

interface IModalsController {
    isNewProfileOpen: boolean;
    openNewProfileModal: () => void;
    closeNewProfileModal: () => void;
    isProfileViewModalOpen: boolean;
    profileViewModalId: string;
    openProfileViewModal: (data: string) => void;
    closeProfileViewModal: () => void;

    isDistanceListOpen: boolean;
    distanceListId: string;
    openDistanceList: (id: string) => void;
    closeDistanceList: () => void;
}

export const useModalControllerStore = create<IModalsController>()(set => ({
    isNewProfileOpen: false,
    openNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: true })),
    closeNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: false })),
    isProfileViewModalOpen: false,
    profileViewModalId: '',
    openProfileViewModal: data => set({ profileViewModalId: data, isProfileViewModalOpen: true }),
    closeProfileViewModal: () => set({ profileViewModalId: '', isProfileViewModalOpen: false }),

    isDistanceListOpen: false,
    distanceListId: '',
    openDistanceList: id => set({ distanceListId: id, isDistanceListOpen: true }),
    closeDistanceList: () => set({ distanceListId: 'distanceListId', isDistanceListOpen: false }),
}));
