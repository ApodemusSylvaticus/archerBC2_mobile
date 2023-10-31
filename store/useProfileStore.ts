import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IBullet, ICartridge, IDescription, IRiffle, IZeroing, Profile } from '@/interface/profile';
import { AsyncStore } from '@/constant/asyncStore';
import { WithFileName } from '@/interface/helper';
import { IDraggableListItem } from '@/store/useModalControllerStore';

interface IUseProfileStore {
    //
    profiles: Profile[];
    addNewProfile: (profile: Profile) => void;
    importProfile: (profile: Profile) => void;
    //
    selectedProfiles: string[];
    getProfileFromStore: () => Promise<void>;
    //
    setProfileRifle: (data: WithFileName<IRiffle>) => void;
    setProfileBullet: (data: WithFileName<IBullet>) => void;
    setZeroing: (data: WithFileName<IZeroing>) => void;
    setCartridge: (data: WithFileName<ICartridge>) => void;
    setDescription: (data: WithFileName<IDescription & { prevFileName: string }>) => void;
    setDistance: (data: WithFileName<{ data: IDraggableListItem[] }>) => void;
    //

    deleteProfile: (fileName: string) => void;

    selectProfile: (data: string) => void;
    deselectProfile: (data: string) => void;
    sendSelected: () => void;
}

export const useProfileStore = create<IUseProfileStore>()(set => ({
    profiles: [
        {
            fileName: 'sadasdxczxs',
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
            twistDir: 'RIGHT',
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
            coefG1: [{ bcCd: 0.5, mv: 2500 }],
            coefG7: [{ bcCd: 0.6, mv: 2450 }],
            coefCustom: [{ bcCd: 0.55, mv: 2480 }],
        },
    ],
    selectedProfiles: [],
    deleteProfile: fileName =>
        set(state => {
            const newState = state.profiles.filter(el => el.fileName !== fileName);
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(newState)).catch(console.log);
            return { profiles: newState };
        }),
    getProfileFromStore: async () => {
        try {
            const profiles = await AsyncStorage.getItem(AsyncStore.profiles);
            set({ profiles: JSON.parse(profiles ?? '[]') });
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
    importProfile: profile =>
        set(state => {
            const profileWithThisFileName = state.profiles.find(el => el.fileName === profile.fileName);
            const newState = { profiles: [] as Profile[] };

            if (profileWithThisFileName) {
                newState.profiles = state.profiles.map(el => (el.fileName === profile.fileName ? profile : el));
            } else {
                newState.profiles = [profile, ...state.profiles];
            }

            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(newState.profiles)).catch(console.log);
            return newState;
        }),
    setProfileRifle: ({ caliber, rTwist, twistDir, scHeight, fileName }) =>
        set(state => {
            const profiles = state.profiles.map(el => {
                if (el.fileName !== fileName) {
                    return el;
                }

                return {
                    ...el,
                    caliber,
                    rTwist,
                    twistDir,
                    scHeight,
                };
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return {
                profiles,
            };
        }),
    setProfileBullet: ({ fileName, bWeight, bcType, coefG7, coefG1, coefCustom, bLength, bDiameter }) =>
        set(state => {
            const profiles = state.profiles.map(el => {
                if (el.fileName !== fileName) {
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
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return {
                profiles,
            };
        }),
    setZeroing: ({
        fileName,
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
            const profiles = state.profiles.map(el => {
                if (el.fileName !== fileName) {
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
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return {
                profiles,
            };
        }),

    setCartridge: ({ fileName, cTCoeff, cZeroTemperature, cMuzzleVelocity }) =>
        set(state => {
            const profiles = state.profiles.map(el => {
                if (el.fileName !== fileName) {
                    return el;
                }
                return {
                    ...el,
                    cTCoeff,
                    cZeroTemperature,
                    cMuzzleVelocity,
                };
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return {
                profiles,
            };
        }),

    setDescription: ({
        fileName,
        profileName,
        cartridgeName,
        bulletName,
        shortNameBot,
        shortNameTop,
        userNote,
        prevFileName,
    }) =>
        set(state => {
            const profiles = state.profiles.map(el => {
                if (el.fileName !== prevFileName) {
                    return el;
                }
                return {
                    ...el,
                    fileName,
                    profileName,
                    cartridgeName,
                    bulletName,
                    shortNameTop,
                    userNote,
                    shortNameBot,
                };
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return { profiles };
        }),

    selectProfile: data => set(state => ({ selectedProfiles: [...state.selectedProfiles, data] })),
    deselectProfile: data =>
        set(state => ({ selectedProfiles: state.selectedProfiles.filter(profileId => profileId !== data) })),

    sendSelected: () => set({ selectedProfiles: [] }),

    setDistance: ({ fileName, data }) =>
        set(state => {
            const distances: number[] = [];
            let zeroIndex = 0;

            data.forEach((el, index) => {
                distances.push(+el.title);
                if (el.isZeroDistance) {
                    zeroIndex = index;
                }
            });

            const profiles = state.profiles.map(el => {
                if (el.fileName !== fileName) {
                    return el;
                }
                return {
                    ...el,
                    distances,
                    cZeroDistanceIdx: zeroIndex,
                };
            });
            AsyncStorage.setItem(AsyncStore.profiles, JSON.stringify(profiles)).catch(console.log);

            return { profiles };
        }),
}));
