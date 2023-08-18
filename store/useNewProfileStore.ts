import { create } from 'zustand';
import { Nullable } from '@/interface/helper';
import {
    BallisticFunctionType,
    BallisticProfileType,
    CoefficientForm,
    IBulletForm,
    ICartridgeForm,
    IDescriptionForm,
    IRiffleForm,
    MultiProfileType,
    RANGE,
    SingleProfileType,
} from '@/interface/newProfile';

interface INewProfile {
    description: IDescriptionForm;
    riffle: IRiffleForm;
    cartridge: ICartridgeForm;
    bullet: IBulletForm;
    range: Nullable<RANGE>;
    ballisticFunction: Nullable<BallisticFunctionType>;
    ballisticProfile: Nullable<SingleProfileType | MultiProfileType>;
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
}

const a: CoefficientForm[] = [
    { mv: '', bc: '' },
    { bc: '', mv: '' },
];

export const emptyProfile: INewProfile = {
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

    setDescription: data => set({ description: data }),
    setRiffle: data => set({ riffle: data }),
    setCartridge: data => set({ cartridge: data }),
    setBullet: data => set({ bullet: data }),
    setRange: data => set({ range: data }),
    setBallisticFunctionType: data => set({ ballisticFunction: data }),
    setBallisticProfile: data =>
        set({
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
        }),

    setMultiCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.SINGLE) {
                throw new Error('This function for multi coefficient');
            }
            return { ballisticProfile: { coefficient: data, type: BallisticProfileType.MULTI } };
        }),

    setSingleCoefficient: data =>
        set(state => {
            if (state.ballisticProfile === null) {
                throw new Error('Ballistic profile type unset');
            }

            if (state.ballisticProfile.type === BallisticProfileType.MULTI) {
                throw new Error('This function for multi coefficient');
            }
            return { ballisticProfile: { coefficient: data, type: BallisticProfileType.SINGLE } };
        }),
    reset: () => set({ ...emptyProfile }),
}));
