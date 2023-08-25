import { create } from 'zustand';

interface IModalsController {
    isNewProfileOpen: boolean;
    openNewProfileModal: () => void;
    closeNewProfileModal: () => void;
    isProfileViewModalOpen: boolean;
    profileViewModalId: string;
    openProfileViewModal: (data: string) => void;
    closeProfileViewModal: () => void;

    isPixelEditorOpen: boolean;
    openPixelEditor: () => void;
    closePixelEditor: () => void;
}

export const useModalControllerStore = create<IModalsController>()(set => ({
    isNewProfileOpen: false,
    openNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: true })),
    closeNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: false })),

    isProfileViewModalOpen: false,
    profileViewModalId: '',
    openProfileViewModal: data => set({ profileViewModalId: data, isProfileViewModalOpen: true }),
    closeProfileViewModal: () => set({ profileViewModalId: '', isProfileViewModalOpen: false }),

    isPixelEditorOpen: false,
    openPixelEditor: () => set({ isPixelEditorOpen: true }),
    closePixelEditor: () => set({ isPixelEditorOpen: false }),
}));
