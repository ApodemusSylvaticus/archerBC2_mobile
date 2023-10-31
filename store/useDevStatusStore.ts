import { create } from 'zustand/esm';
import { ZOOM } from '@/interface/core/coreProtobuf';
import { Nullable } from '@/interface/helper';

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
    activeProfile: Nullable<string>;
    setActiveProfile: (data: string) => void;
    setWindParam: (data: { windDir: number; pitch: number }) => void;
    setEnvironmentParam: (data: { airPress: number; airHum: number; airTemp: number; powderTemp: number }) => void;
}

export const useDevStatusStore = create<IUseDevStatusStore>()(set => ({
    devStatus: null,
    activeProfile: null,
    setActiveProfile: data => set({ activeProfile: data }),
    setDevStatus: data => set({ devStatus: data }),
    setEnvironmentParam: data =>
        set(state => {
            if (state.devStatus === null) {
                throw new Error('Call method setEnvironmentParam before initialization');
            }
            return { devStatus: { ...state.devStatus, ...data } };
        }),
    setWindParam: data =>
        set(state => {
            if (state.devStatus === null) {
                throw new Error('Call method setWindParam before initialization');
            }
            return { devStatus: { ...state.devStatus, ...data } };
        }),
}));
