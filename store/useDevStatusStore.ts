import { create } from 'zustand/esm';
import { Nullable } from '@/interface/helper';
import { testShotConditional } from '@/constant/testValue';
import { Coefficient, SwitchPosition, TwistDirection } from '@/interface/profile';
import { ZOOM_DEV_STATUS } from '@/interface/core/coreProtobuf';

export interface DevStatus {
    charge: number;
    airTemp: number;
    airHum: number;
    airPress: number;
    powderTemp: number;
    windDir: number;
    zoom: ZOOM_DEV_STATUS;
    windSpeed: number;
    cant: number;
    distance: number;
    currProfile: number;
}

export interface ProfileDevStatus {
    bDiameter: number;
    bLength: number;
    bWeight: number;
    bcType: number;
    bulletName: string;
    cMuzzleVelocity: number;
    cTCoeff: number;
    cZeroAirHumidity: number;
    cZeroAirPressure: number;
    cZeroAirTemperature: number;
    cZeroDistanceIdx: number;
    cZeroPTemperature: number;
    cZeroTemperature: number;
    cZeroWPitch: number;
    caliber: string;
    cartridgeName: string;
    coefRows: Coefficient[];
    deviceUuid: string;
    distances: number[];
    profileName: string;
    rTwist: number;
    scHeight: number;
    shortNameBot: string;
    shortNameTop: string;
    switches: SwitchPosition[];
    twistDir: TwistDirection;
    userNote: string;
    zeroX: number;
    zeroY: number;
}

interface IUseDevStatusStore {
    isTesting: boolean;
    setIsTestMode: (data: boolean) => void;
    devStatus: Nullable<DevStatus>;
    setDevStatus: (data: DevStatus) => void;
    activeProfile: Nullable<ProfileDevStatus>;
    setActiveProfile: (data: ProfileDevStatus) => void;
    setWindParam: (data: { windDir: number; windSpeed: number }) => void;
    setEnvironmentParam: (data: { airPress: number; airHum: number; airTemp: number; powderTemp: number }) => void;
}

export const useDevStatusStore = create<IUseDevStatusStore>()(set => ({
    devStatus: null,
    activeProfile: null,

    isTesting: false,
    setIsTestMode: data =>
        set(() => {
            return {
                isTesting: data,
                devStatus: data ? testShotConditional.devStatus : null,
                activeProfile: data ? testShotConditional.activeProfile : null,
            };
        }),
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
