import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProfileWithId } from '@/interface/profile';
import { AsyncStore } from '@/constant/asyncStore';
import { Nullable } from '@/interface/helper';

interface IUseProfileStore {
    profiles: ProfileWithId[];
    actualProfiles: ProfileWithId[];
    addNewProfile: (profile: ProfileWithId) => void;
    getProfileFromStore: () => Promise<void>;
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
    getProfileFromStore: async () => {
        try {
            const data = (await AsyncStorage.getItem(AsyncStore.profiles)) as Nullable<ProfileWithId[]>;
            if (data) {
                set({ profiles: data });
            }
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
}));
