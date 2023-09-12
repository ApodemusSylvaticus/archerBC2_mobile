import { create } from 'zustand/esm';
import { ZOOM } from '@/interface/core/coreProtobuf';
import { Nullable } from '@/interface/helper';

interface envProfile {
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

interface IUseEnvironmentStore {
    envProfile: Nullable<envProfile>;
    setEnvProfile: (data: envProfile) => void;
}

export const useEnvironmentStore = create<IUseEnvironmentStore>()(set => ({
    envProfile: null,
    setEnvProfile: data => set({ envProfile: data }),
}));
