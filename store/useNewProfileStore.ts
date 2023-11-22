import { create } from 'zustand';
import { Nullable } from '@/interface/helper';
import {
    BallisticFunctionType,
    BallisticProfileType,
    CoefficientForm,
    IBallisticProfile,
    IBulletForm,
    ICartridgeForm,
    IDescriptionForm,
    IRiffleForm,
    RANGE,
} from '@/interface/newProfile';

export interface INewProfile {
    description: IDescriptionForm;
    riffle: IRiffleForm;
    cartridge: ICartridgeForm;
    bullet: IBulletForm;
    range: Nullable<RANGE>;
    ballisticFunction: Nullable<BallisticFunctionType>;
    ballisticProfile: Nullable<IBallisticProfile>;
    fileName: Nullable<string>;
}

interface Coeff {
    single: number;
    multi: { bcCd: number; mv: number }[];
}

export interface BulletFromDB {
    name: string;
    bDiameter: number;
    bWeight: number;
    bLength: number;
    coefG1: Coeff;
    coefG7: Coeff;
}

interface IUseNewProfileStore extends INewProfile {
    setDescription: (data: IDescriptionForm) => void;
    setRiffle: (data: IRiffleForm) => void;
    setCartridge: (data: ICartridgeForm) => void;
    setBullet: (data: IBulletForm) => void;
    setRange: (data: RANGE) => void;
    setBallisticFunctionType: (data: BallisticFunctionType) => void;
    setBallisticProfile: (data: BallisticProfileType) => void;
    setSingleCoefficient: (data: string) => void;
    setMultiCoefficient: (data: CoefficientForm[]) => void;
    reset: () => void;
    setFileName: (data: string) => void;

    selectBulletFromList: (data: BulletFromDB) => void;
    selectCaliberFromList: (data: { name: string; bDiameter: number }) => void;
}

export const emptyProfile: INewProfile = {
    description: {
        profileName: '',
        bullet: '',
        cartridge: '',
    },
    riffle: {
        rTwist: '',
        scHeight: '',
        twistDir: 'RIGHT',
        caliber: '',
    },
    ballisticFunction: null,
    ballisticProfile: null,
    bullet: {
        bWeight: '',
        bDiameter: '',
        bLength: '',
    },
    cartridge: {
        cZeroTemperature: '',
        cMuzzleVelocity: '',
        cTCoeff: '',
    },
    range: null,
    fileName: null,
};

export const useNewProfileStore = create<IUseNewProfileStore>()(set => ({
    ...emptyProfile,

    setDescription: data => set({ description: data }),
    setRiffle: data => set({ riffle: data }),
    setCartridge: data => set({ cartridge: data }),
    setBullet: data => set({ bullet: data }),
    setRange: data => set({ range: data }),
    setBallisticFunctionType: data => set({ ballisticFunction: data }),
    setBallisticProfile: data =>
        set(state => ({
            ballisticProfile: {
                type: data,

                G1: state.ballisticProfile?.G1 ?? {
                    single: '',
                    multi: [
                        { mv: '', bcCd: '' },
                        { bcCd: '', mv: '' },
                    ],
                },
                G7: state.ballisticProfile?.G7 ?? {
                    single: '',
                    multi: [
                        { mv: '', bcCd: '' },
                        { bcCd: '', mv: '' },
                    ],
                },
            },
        })),
    setFileName: data => set({ fileName: data }),
    setMultiCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.SINGLE) {
                throw new Error('This function for multi coefficient');
            }
            const { ballisticFunction } = state;

            if (ballisticFunction === null) {
                throw new Error('Ballistit function === null');
            }
            const G1 =
                ballisticFunction === BallisticFunctionType.G1
                    ? { single: state.ballisticProfile.G1.single, multi: data }
                    : state.ballisticProfile.G1;

            const G7 =
                ballisticFunction === BallisticFunctionType.G7
                    ? { single: state.ballisticProfile.G7.single, multi: data }
                    : state.ballisticProfile.G7;

            return { ballisticProfile: { type: BallisticProfileType.MULTI, G1, G7 } };
        }),
    setSingleCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.MULTI) {
                throw new Error('This function for multi coefficient');
            }

            const { ballisticFunction } = state;

            if (ballisticFunction === null) {
                throw new Error('ballisticFunction === null');
            }
            const G1 =
                ballisticFunction === BallisticFunctionType.G1
                    ? { single: data, multi: state.ballisticProfile.G1.multi }
                    : state.ballisticProfile.G1;

            const G7 =
                ballisticFunction === BallisticFunctionType.G7
                    ? { single: data, multi: state.ballisticProfile.G7.multi }
                    : state.ballisticProfile.G7;

            return { ballisticProfile: { type: BallisticProfileType.SINGLE, G1, G7 } };
        }),
    reset: () => set({ ...emptyProfile }),

    selectCaliberFromList: data =>
        set(state => ({
            riffle: { ...state.riffle, caliber: data.name },
            bullet: { ...state.bullet, bDiameter: data.bDiameter.toString() },
        })),
    selectBulletFromList: data =>
        set(state => {
            const { description, ballisticProfile } = state;

            return {
                bullet: {
                    bWeight: data.bWeight.toString(),
                    bLength: data.bLength.toString(),
                    bDiameter: data.bDiameter.toString(),
                },
                description: {
                    ...description,
                    bullet: data.name,
                },
                ballisticProfile: {
                    type: ballisticProfile?.type ?? BallisticProfileType.MULTI,
                    G1: {
                        single: data.coefG1.single.toString(),
                        multi: data.coefG1.multi.map(el => ({ bcCd: el.bcCd.toString(), mv: el.mv.toString() })),
                    },

                    G7: {
                        single: data.coefG7.single.toString(),
                        multi: data.coefG7.multi.map(el => ({ bcCd: el.bcCd.toString(), mv: el.mv.toString() })),
                    },
                },
            };
        }),
}));
