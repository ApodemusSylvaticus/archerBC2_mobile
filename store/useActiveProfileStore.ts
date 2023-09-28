import { create } from 'zustand/esm';
import { Profile, ServerProfile } from '@/interface/profile';
import { Nullable } from '@/interface/helper';
import { Decimals } from '@/constant/decimals';

interface ActiveProfileMap {
    [key: string]: Nullable<Profile>;
}

interface IUseActiveProfileStore {
    activeProfilesMap: ActiveProfileMap;
    activeProfile: string;

    setActiveProfile: (fileName: string) => void;
    fileList: string[];
    setFileList: (fileList: string[]) => void;
    getProfile: (fileName: string, profile: ServerProfile) => void;
    addNewProfile: (fileName: string, profile: ServerProfile) => void;
    updateProfile: (fileName: string, profile: ServerProfile) => void;
    deleteProfile: (fileName: string) => void;
}
export const useActiveProfileStore = create<IUseActiveProfileStore>()(set => ({
    activeProfilesMap: {},
    activeProfile: '',
    fileList: [],
    updateCartridge: {},
    setActiveProfile: fileName => set({ activeProfile: fileName }),
    setFileList: fileList =>
        set(() => {
            const activeProfilesMap: ActiveProfileMap = {};
            fileList.forEach(el => {
                activeProfilesMap[el] = null;
            });
            return { fileList, activeProfile: fileList[0], activeProfilesMap };
        }),
    getProfile: (fileName, profile) =>
        set(state => {
            return {
                activeProfilesMap: {
                    ...state.activeProfilesMap,
                    [fileName]: {
                        fileName,
                        caliber: profile.caliber,
                        rTwist: profile.rTwist / Decimals.rTwist,
                        profileName: profile.profileName,
                        bcType: profile.bcType,
                        cZeroAirPressure: profile.cZeroAirPressure / Decimals.cZeroAirPressure,
                        cZeroAirHumidity: profile.cZeroAirHumidity,
                        cTCoeff: profile.cTCoeff / Decimals.cTCoeff,
                        cZeroDistanceIdx: profile.cZeroDistanceIdx,
                        cZeroWPitch: profile.cZeroWPitch / Decimals.cZeroPitch,
                        cZeroAirTemperature: profile.cZeroAirTemperature,
                        cZeroTemperature: profile.cZeroAirTemperature,
                        cMuzzleVelocity: profile.cMuzzleVelocity / Decimals.cMuzzleVelocity,
                        cZeroPTemperature: profile.cZeroPTemperature,
                        cartridgeName: profile.cartridgeName,
                        scHeight: profile.scHeight,
                        shortNameTop: profile.shortNameTop,
                        switches: profile.switches.map(el => ({ ...el, distance: el.distance / Decimals.distances })),
                        shortNameBot: profile.shortNameBot,
                        distances: profile.distances.map(el => el / Decimals.distances),
                        userNote: profile.userNote,
                        twistDir: profile.twistDir,
                        bWeight: profile.bWeight / Decimals.bWeight,
                        bLength: profile.bLength / Decimals.bLength,
                        bDiameter: profile.bDiameter / Decimals.bDiameter,
                        bulletName: profile.bulletName,
                        zeroY: profile.zeroY / Decimals.zeroY,
                        zeroX: profile.zeroX / Decimals.zeroX,
                        deviceUuid: profile.deviceUuid,
                        id: `${profile.profileName}_${profile.bulletName}_${profile.cartridgeName}`,
                        coefG1:
                            profile.bcType === 'G1'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd: bcCd / Decimals.bcCd,
                                      mv: mv / Decimals.mv,
                                  }))
                                : [],
                        coefG7:
                            profile.bcType === 'G7'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd: bcCd / Decimals.bcCd,
                                      mv: mv / Decimals.mv,
                                  }))
                                : [],
                        coefCustom: [],
                    },
                },
            };
        }),

    addNewProfile: (fileName, profile) =>
        set(state => {
            return {
                activeProfilesMap: {
                    ...state.activeProfilesMap,
                    [fileName]: {
                        fileName,
                        caliber: profile.caliber,
                        rTwist: profile.rTwist / Decimals.rTwist,
                        profileName: profile.profileName,
                        bcType: profile.bcType,
                        cZeroAirPressure: profile.cZeroAirPressure / Decimals.cZeroAirPressure,
                        cZeroAirHumidity: profile.cZeroAirHumidity,
                        cTCoeff: profile.cTCoeff / Decimals.cTCoeff,
                        cZeroDistanceIdx: profile.cZeroDistanceIdx,
                        cZeroWPitch: profile.cZeroWPitch / Decimals.cZeroPitch,
                        cZeroAirTemperature: profile.cZeroAirTemperature,
                        cZeroTemperature: profile.cZeroAirTemperature,
                        cMuzzleVelocity: profile.cMuzzleVelocity / Decimals.cMuzzleVelocity,
                        cZeroPTemperature: profile.cZeroPTemperature,
                        cartridgeName: profile.cartridgeName,
                        scHeight: profile.scHeight,
                        shortNameTop: profile.shortNameTop,
                        switches: profile.switches.map(el => ({ ...el, distance: el.distance / Decimals.distances })),
                        shortNameBot: profile.shortNameBot,
                        distances: profile.distances.map(el => el / Decimals.distances),
                        userNote: profile.userNote,
                        twistDir: profile.twistDir,
                        bWeight: profile.bWeight / Decimals.bWeight,
                        bLength: profile.bLength / Decimals.bLength,
                        bDiameter: profile.bDiameter / Decimals.bDiameter,
                        bulletName: profile.bulletName,
                        zeroY: profile.zeroY / Decimals.zeroY,
                        zeroX: profile.zeroX / Decimals.zeroX,
                        deviceUuid: profile.deviceUuid,
                        id: `${profile.profileName}_${profile.bulletName}_${profile.cartridgeName}`,
                        coefG1:
                            profile.bcType === 'G1'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd: bcCd / Decimals.bcCd,
                                      mv: mv / Decimals.mv,
                                  }))
                                : [],
                        coefG7:
                            profile.bcType === 'G7'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd: bcCd / Decimals.bcCd,
                                      mv: mv / Decimals.mv,
                                  }))
                                : [],
                        coefCustom: [],
                    },
                },
                fileList: [...state.fileList, fileName],
            };
        }),
    updateProfile: (fileName, profile) =>
        set(state => ({
            activeProfilesMap: {
                ...state.activeProfilesMap,
                [fileName]: {
                    fileName,
                    caliber: profile.caliber,
                    rTwist: profile.rTwist / Decimals.rTwist,
                    profileName: profile.profileName,
                    bcType: profile.bcType,
                    cZeroAirPressure: profile.cZeroAirPressure / Decimals.cZeroAirPressure,
                    cZeroAirHumidity: profile.cZeroAirHumidity,
                    cTCoeff: profile.cTCoeff / Decimals.cTCoeff,
                    cZeroDistanceIdx: profile.cZeroDistanceIdx,
                    cZeroWPitch: profile.cZeroWPitch / Decimals.cZeroPitch,
                    cZeroAirTemperature: profile.cZeroAirTemperature,
                    cZeroTemperature: profile.cZeroAirTemperature,
                    cMuzzleVelocity: profile.cMuzzleVelocity / Decimals.cMuzzleVelocity,
                    cZeroPTemperature: profile.cZeroPTemperature,
                    cartridgeName: profile.cartridgeName,
                    scHeight: profile.scHeight,
                    shortNameTop: profile.shortNameTop,
                    switches: profile.switches.map(el => ({ ...el, distance: el.distance / Decimals.distances })),
                    shortNameBot: profile.shortNameBot,
                    distances: profile.distances.map(el => el / Decimals.distances),
                    userNote: profile.userNote,
                    twistDir: profile.twistDir,
                    bWeight: profile.bWeight / Decimals.bWeight,
                    bLength: profile.bLength / Decimals.bLength,
                    bDiameter: profile.bDiameter / Decimals.bDiameter,
                    bulletName: profile.bulletName,
                    zeroY: profile.zeroY / Decimals.zeroY,
                    zeroX: profile.zeroX / Decimals.zeroX,
                    deviceUuid: profile.deviceUuid,
                    id: `${profile.profileName}_${profile.bulletName}_${profile.cartridgeName}`,
                    coefG1:
                        profile.bcType === 'G1'
                            ? profile.coefRows.map(({ bcCd, mv }) => ({
                                  bcCd: bcCd / Decimals.bcCd,
                                  mv: mv / Decimals.mv,
                              }))
                            : state.activeProfilesMap[fileName]!.coefG1,
                    coefG7:
                        profile.bcType === 'G7'
                            ? profile.coefRows.map(({ bcCd, mv }) => ({
                                  bcCd: bcCd / Decimals.bcCd,
                                  mv: mv / Decimals.mv,
                              }))
                            : state.activeProfilesMap[fileName]!.coefG7,
                    coefCustom: [],
                },
            },
        })),
    deleteProfile: fileName => {
        set(state => {
            const updatedActiveProfilesMap = { ...state.activeProfilesMap };

            delete updatedActiveProfilesMap[fileName];

            const newFileList = state.fileList.filter(el => el !== fileName);
            return {
                activeProfilesMap: updatedActiveProfilesMap,
                fileList: newFileList,
                activeProfile: newFileList[0],
            };
        });
    },
}));
