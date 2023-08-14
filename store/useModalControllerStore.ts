import { create } from 'zustand';

interface IModalsController {
    isNewProfileOpen: boolean;
    openNewProfileModal: () => void;
    closeNewProfileModal: () => void;
}

export const useModalControllerStore = create<IModalsController>()(set => ({
    isNewProfileOpen: false,
    openNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: true })),
    closeNewProfileModal: () => set(state => ({ ...state, isNewProfileOpen: false })),
}));
