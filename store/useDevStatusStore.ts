import { create } from 'zustand/esm';
import { ZOOM } from '@/interface/core/coreProtobuf';
import { Nullable } from '@/interface/helper';
import { ServerProfile } from '@/interface/profile';

interface devStatus {
    charge: number;
    zoom: ZOOM;
    airTemp: number;
    airHum: number;
    airPress: number;
    powderTemp: number;
    windDir: number;
    pitch: number;
    cant: number;
    distance: number;
    currProfile: number;
}

interface IUseDevStatusStore {
    devStatus: Nullable<devStatus>;
    setDevStatus: (data: devStatus) => void;

    setWindParam: (data: { windDir: number; pitch: number }) => void;
    setEnvironmentParam: (data: { airPress: number; airHum: number; airTemp: number; powderTemp: number }) => void;

    // Temp
    actualProfile: Nullable<ServerProfile>;
    getActualProfile: (data: ServerProfile) => void;
}

export const useDevStatusStore = create<IUseDevStatusStore>()(set => ({
    devStatus: null,
    setDevStatus: data => set({ devStatus: data }),
    setEnvironmentParam: data =>
        set(state => {
            if (state.devStatus === null) {
                throw new Error('TODO ERROR');
            }
            return { devStatus: { ...state.devStatus, ...data } };
        }),
    setWindParam: data =>
        set(state => {
            if (state.devStatus === null) {
                throw new Error('TODO ERROR');
            }
            return { devStatus: { ...state.devStatus, ...data } };
        }),

    actualProfile: null,
    getActualProfile: data => set({ actualProfile: data }),
}));
