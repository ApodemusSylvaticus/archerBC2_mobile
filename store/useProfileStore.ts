import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBullet, ICartridge, IDescription, IRiffle, IZeroing, ProfileWithId } from '@/interface/profile';
import { AsyncStore } from '@/constant/asyncStore';
import { WithId } from '@/interface/helper';

interface IUseProfileStore {
    profiles: ProfileWithId[];
    actualProfiles: ProfileWithId[];
    selectedProfiles: string[];
    addNewProfile: (profile: ProfileWithId) => void;
    getProfileFromStore: () => Promise<void>;
    setProfileRifle: (data: WithId<IRiffle>) => void;
    setProfileBullet: (data: WithId<IBullet>) => void;
    setZeroing: (data: WithId<IZeroing>) => void;
    setCartridge: (data: WithId<ICartridge>) => void;
    setDescription: (data: WithId<IDescription>) => void;
    selectProfile: (data: string) => void;
    deselectProfile: (data: string) => void;
    sendSelected: () => void;
}

export const useProfileStore = create<IUseProfileStore>()(set => ({
    profiles: [
        {
            id: 'sadasdxczxs',
            profileName: 'Sample Profile',
            cartridgeName: 'Sample Cartridge',
            bulletName: 'Sample Bullet',
            caliber: 'Sample Caliber',
            deviceUuid: '12345',
            shortNameTop: 'ST',
            shortNameBot: 'SB',
            userNote: 'This is a sample note.',
            zeroX: 0,
            zeroY: 0,
            distances: [100, 200],
            switches: [
                {
                    cIdx: 0,
                    distance: 100,
                    distanceFrom: 'index',
                    reticleIdx: 1,
                    zoom: 2,
                },
                {
                    cIdx: 1,
                    distance: 200,
                    distanceFrom: 'value',
                    reticleIdx: 2,
                    zoom: 3,
                },
            ],
            scHeight: 1000,
            rTwist: 5,
            twistDir: 'right',
            cMuzzleVelocity: 2500,
            cZeroTemperature: 25,
            cTCoeff: 2.5,
            cZeroDistanceIdx: 0,
            cZeroAirTemperature: 20,
            cZeroAirPressure: 1000,
            cZeroAirHumidity: 50,
            cZeroWPitch: 0,
            cZeroPTemperature: 25,
            bDiameter: 0.308,
            bWeight: 150,
            bLength: 3,
            bcType: 'G1',
            coefG1: [{ bc: 0.5, mv: 2500 }],
            coefG7: [{ bc: 0.6, mv: 2450 }],
            coefCustom: [{ bc: 0.55, mv: 2480 }],
        },
    ],
    actualProfiles: [],
    selectedProfiles: [],
    getProfileFromStore: async () => {
        try {
            const profiles = await AsyncStorage.getItem(AsyncStore.profiles);
            const actualProfiles = await AsyncStorage.getItem(AsyncStore.actualProfiles);
            set({ profiles: JSON.parse(profiles ?? '[]'), actualProfiles: JSON.parse(actualProfiles ?? '[]') });
        } catch (e) {
            console.log(e);
        }
    },
    addNewProfile: profile =>
        set(state => {
            const newState = {
                ...state,
                profiles: [...state.profiles, profile],
            };
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(newState.profiles)).catch(console.log);
            return newState;
        }),
    setProfileRifle: ({ caliber, rTwist, twistDir, scHeight, id }) =>
        set(state => {
            return {
                profiles: state.profiles.map(el => {
                    if (el.id !== id) {
                        return el;
                    }
                    return {
                        ...el,
                        caliber,
                        rTwist,
                        twistDir,
                        scHeight,
                    };
                }),
            };
        }),
    setProfileBullet: ({ id, bWeight, bcType, coefG7, coefG1, coefCustom, bLength, bDiameter }) =>
        set(state => {
            return {
                profiles: state.profiles.map(el => {
                    if (el.id !== id) {
                        return el;
                    }
                    return {
                        ...el,
                        bWeight,
                        bcType,
                        coefG7,
                        coefG1,
                        coefCustom,
                        bLength,
                        bDiameter,
                    };
                }),
            };
        }),
    setZeroing: ({
        id,
        zeroY,
        cZeroWPitch,
        cZeroPTemperature,
        cZeroAirTemperature,
        cZeroAirPressure,
        cZeroAirHumidity,
        zeroX,
        cZeroDistanceIdx,
        distances,
    }) =>
        set(state => {
            return {
                profiles: state.profiles.map(el => {
                    if (el.id !== id) {
                        return el;
                    }
                    return {
                        ...el,
                        zeroY,
                        zeroX,
                        cZeroDistanceIdx,
                        cZeroWPitch,
                        cZeroAirTemperature,
                        cZeroAirPressure,
                        cZeroAirHumidity,
                        cZeroPTemperature,
                        distances,
                    };
                }),
            };
        }),

    setCartridge: ({ id, cTCoeff, cZeroTemperature, cMuzzleVelocity }) =>
        set(state => {
            return {
                profiles: state.profiles.map(el => {
                    if (el.id !== id) {
                        return el;
                    }
                    return {
                        ...el,
                        cTCoeff,
                        cZeroTemperature,
                        cMuzzleVelocity,
                    };
                }),
            };
        }),

    setDescription: ({ id, profileName, cartridgeName, bulletName, shortNameBot, shortNameTop, userNote }) =>
        set(state => {
            return {
                profiles: state.profiles.map(el => {
                    if (el.id !== id) {
                        return el;
                    }
                    return {
                        ...el,
                        profileName,
                        cartridgeName,
                        bulletName,
                        shortNameTop,
                        userNote,
                        shortNameBot,
                    };
                }),
            };
        }),

    selectProfile: data => set(state => ({ selectedProfiles: [...state.selectedProfiles, data] })),
    deselectProfile: data =>
        set(state => ({ selectedProfiles: state.selectedProfiles.filter(profileId => profileId !== data) })),

    sendSelected: () =>
        set(state => {
            const selectedProfiles = state.selectedProfiles.map(el => {
                const res = state.profiles.find(profile => profile.id === el);
                if (res === undefined) {
                    throw new Error('TODO ERROR');
                }
                return res;
            });

            AsyncStorage.setItem(
                AsyncStore.actualProfiles,
                JSON.stringify([...state.actualProfiles, ...selectedProfiles]),
            ).catch(console.log);

            return { actualProfiles: [...state.actualProfiles, ...selectedProfiles], selectedProfiles: [] };
        }),
}));
