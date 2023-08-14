import { create } from 'zustand';
import { Nullable } from '@/interface/helper';
import {
    BallisticFunctionType,
    BallisticProfileType,
    Coefficient,
    IBullet,
    ICartridge,
    IDescription,
    IRiffle,
    MultiProfileType,
    RANGE,
    SingleProfileType,
} from '@/interface/newProfile';

interface INewProfile {
    description: IDescription;
    riffle: IRiffle;
    cartridge: ICartridge;
    bullet: IBullet;
    range: Nullable<RANGE>;
    ballisticFunction: Nullable<BallisticFunctionType>;
    ballisticProfile: Nullable<SingleProfileType | MultiProfileType>;
}
interface IUseNewProfileStore extends INewProfile {
    setDescription: (data: IDescription) => void;
    setRiffle: (data: IRiffle) => void;
    setCartridge: (data: ICartridge) => void;
    setBullet: (data: IBullet) => void;
    setRange: (data: RANGE) => void;
    setBallisticFunctionType: (data: BallisticFunctionType) => void;
    setBallisticProfile: (data: BallisticProfileType) => void;
    setSingleCoefficient: (data: string) => void;
    setMultiCoefficient: (data: Coefficient[]) => void;
    reset: () => void;
}

const a: Coefficient[] = [
    { mv: '', bc: '' },
    { bc: '', mv: '' },
];

const emptyProfile: INewProfile = {
    description: {
        name: '',
        bullet: '',
        cartridge: '',
    },
    riffle: {
        twistRate: '',
        scopeHeight: '',
        twistDirection: 'right',
        calibre: '',
    },
    ballisticFunction: null,
    ballisticProfile: null,
    bullet: {
        weight: '',
        diameter: '',
        length: '',
    },
    cartridge: {
        powderTemperature: '',
        muzzleVelocity: '',
        ratio: '',
    },
    range: null,
};

export const useNewProfileStore = create<IUseNewProfileStore>()(set => ({
    ...emptyProfile,

    setDescription: data => set(state => ({ ...state, description: data })),
    setRiffle: data => set(state => ({ ...state, riffle: data })),
    setCartridge: data => set(state => ({ ...state, cartridge: data })),
    setBullet: data => set(state => ({ ...state, bullet: data })),
    setRange: data => set(state => ({ ...state, range: data })),
    setBallisticFunctionType: data => set(state => ({ ...state, ballisticFunction: data })),
    setBallisticProfile: data =>
        set(state => ({
            ...state,
            ballisticProfile:
                data === BallisticProfileType.SINGLE
                    ? {
                          type: data,
                          coefficient: '',
                      }
                    : {
                          type: data,
                          coefficient: a,
                      },
        })),

    setMultiCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.SINGLE) {
                throw new Error('This function for multi coefficient');
            }
            return { ...state, ballisticProfile: { coefficient: data, type: BallisticProfileType.MULTI } };
        }),

    setSingleCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.MULTI) {
                throw new Error('This function for multi coefficient');
            }
            return { ...state, ballisticProfile: { coefficient: data, type: BallisticProfileType.SINGLE } };
        }),
    reset: () => set(state => ({ ...state, ...emptyProfile })),
}));