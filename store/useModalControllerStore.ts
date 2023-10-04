import { create } from 'zustand';
import { Nullable } from '@/interface/helper';

export interface IDraggableListItem {
    title: string;
    isZeroDistance: boolean;
    id: string;
}

type distanceHandler = (data: IDraggableListItem[]) => void;

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
    distanceList: number[];
    zeroDistanceIdx: number;
    distanceListHandler: distanceHandler;
    openDistanceList: (distances: number[], zeroDistanceIdx: number, handler: distanceHandler) => void;
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
    distanceList: [],
    zeroDistanceIdx: 0,
    distanceListHandler: () => undefined,
    openDistanceList: (distances, zeroDistanceIdx, handler) =>
        set({ zeroDistanceIdx, distanceListHandler: handler, distanceList: distances, isDistanceListOpen: true }),
    closeDistanceList: () => set({ distanceListHandler: () => undefined, distanceList: [], isDistanceListOpen: false }),
}));
