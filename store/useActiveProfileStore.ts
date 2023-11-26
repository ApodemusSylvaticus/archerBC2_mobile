import { create } from 'zustand/esm';
import cloneDeep from 'lodash.clonedeep';
import { Profile, ServerProfile } from '@/interface/profile';
import { Nullable } from '@/interface/helper';
import { Decimals } from '@/constant/decimals';
import { IProfileListServerData } from '@/interface/core/profileProtobuf';
import { testActiveProfile } from '@/constant/testValue';

export interface ActiveProfileMap {
    [key: string]: Nullable<Profile>;
}

interface IUseActiveProfileStore {
    activeProfilesMap: ActiveProfileMap;
    activeProfile: string;

    setActiveProfile: (fileName: string) => void;
    fileList: string[];
    profileListServerData: Nullable<IProfileListServerData>;
    setAllFileListData: (fileList: string[], profileListServerData: IProfileListServerData) => void;
    hardResetAllFileList: (fileList: string[], profileListServerData: IProfileListServerData) => void;

    setProfileListServerData: (data: IProfileListServerData) => void;
    setProfile: (fileName: string, profile: ServerProfile) => void;
    addNewProfiles: (newProfiles: Profile[], list: string[], newProfileListServerData: IProfileListServerData) => void;
    chooseProfileListActiveProfile: (fileName: string) => void;
    updateProfile: (fileName: string, profile: ServerProfile) => void;
    deleteProfile: (fileName: string, newProfileListServerData: IProfileListServerData) => void;
}
export const useActiveProfileStore = create<IUseActiveProfileStore>()(set => ({
    activeProfilesMap: testActiveProfile.isTesting ? testActiveProfile.activeProfilesMap : {},
    activeProfile: testActiveProfile.isTesting ? testActiveProfile.activeProfile : '',
    fileList: testActiveProfile.isTesting ? testActiveProfile.fileList : [],
    profileListServerData: testActiveProfile.isTesting ? testActiveProfile.profileListServerData : null,
    setProfileListServerData: data => set({ profileListServerData: data }),
    setActiveProfile: fileName => set({ activeProfile: fileName }),

    chooseProfileListActiveProfile: fileName =>
        set(state => {
            if (state.profileListServerData === null) {
                throw new Error('profileListServerData is null');
            }

            return {
                profileListServerData: {
                    profileDesc: state.profileListServerData.profileDesc,
                    activeprofile: state.profileListServerData.profileDesc.findIndex(el => el.filePath === fileName),
                },
            };
        }),
    setAllFileListData: (fileList, profileListServerData) =>
        set(state => {
            const newActiveProfiles = cloneDeep(state.activeProfilesMap);
            fileList.forEach(e => {
                newActiveProfiles[e] = newActiveProfiles[e] ?? null;
            });

            return {
                fileList,
                activeProfilesMap: newActiveProfiles,
                profileListServerData,
                activeProfile:
                    state.activeProfile === ''
                        ? profileListServerData.profileDesc[profileListServerData.activeprofile].filePath
                        : state.activeProfile,
            };
        }),
    hardResetAllFileList: (fileList, profileListServerData) =>
        set(() => {
            const activeProfilesMap: ActiveProfileMap = {};
            fileList.forEach(el => {
                activeProfilesMap[el] = null;
            });
            return {
                fileList,
                activeProfile: profileListServerData.profileDesc[profileListServerData.activeprofile].filePath,
                activeProfilesMap,
                profileListServerData,
            };
        }),
    setProfile: (fileName, profile) =>
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

    addNewProfiles: (newProfiles, list, newProfileListServerData) =>
        set(state => {
            const listObj: ActiveProfileMap = {};
            // eslint-disable-next-line no-return-assign
            list.forEach(el => (listObj[el] = null));
            const obj: ActiveProfileMap = {};
            newProfiles.forEach(el => {
                obj[el.fileName] = el;
            });

            const newActiveProfilesMap = {
                ...listObj,
                ...state.activeProfilesMap,
                ...obj,
            };

            return {
                activeProfile: newProfileListServerData.profileDesc[newProfileListServerData.activeprofile].filePath,
                profileListServerData: newProfileListServerData,
                activeProfilesMap: newActiveProfilesMap,
                fileList: list,
            };
        }),
    updateProfile: (fileName, profile) =>
        set(state => {
            const newProfileDesc = state.profileListServerData!.profileDesc.map(el =>
                el.filePath === fileName
                    ? {
                          cartridgeName: profile.cartridgeName,
                          profileName: profile.profileName,
                          filePath: fileName,
                          shortNameBot: profile.shortNameBot,
                          shortNameTop: profile.shortNameTop,
                      }
                    : el,
            );

            return {
                profileListServerData: {
                    profileDesc: newProfileDesc,
                    activeprofile: state.profileListServerData!.activeprofile,
                },
                activeProfilesMap: {
                    ...state.activeProfilesMap,
                    [fileName]: {
                        fileName,
                        caliber: profile.caliber,
                        rTwist: profile.rTwist,
                        profileName: profile.profileName,
                        bcType: profile.bcType,
                        cZeroAirPressure: profile.cZeroAirPressure,
                        cZeroAirHumidity: profile.cZeroAirHumidity,
                        cTCoeff: profile.cTCoeff,
                        cZeroDistanceIdx: profile.cZeroDistanceIdx,
                        cZeroWPitch: profile.cZeroWPitch,
                        cZeroAirTemperature: profile.cZeroAirTemperature,
                        cZeroTemperature: profile.cZeroAirTemperature,
                        cMuzzleVelocity: profile.cMuzzleVelocity,
                        cZeroPTemperature: profile.cZeroPTemperature,
                        cartridgeName: profile.cartridgeName,
                        scHeight: profile.scHeight,
                        shortNameTop: profile.shortNameTop,
                        switches: profile.switches,
                        shortNameBot: profile.shortNameBot,
                        distances: profile.distances,
                        userNote: profile.userNote,
                        twistDir: profile.twistDir,
                        bWeight: profile.bWeight,
                        bLength: profile.bLength,
                        bDiameter: profile.bDiameter,
                        bulletName: profile.bulletName,
                        zeroY: profile.zeroY,
                        zeroX: profile.zeroX,
                        deviceUuid: profile.deviceUuid,
                        id: `${profile.profileName}_${profile.bulletName}_${profile.cartridgeName}`,
                        coefG1:
                            profile.bcType === 'G1'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd,
                                      mv,
                                  }))
                                : state.activeProfilesMap[fileName]!.coefG1,
                        coefG7:
                            profile.bcType === 'G7'
                                ? profile.coefRows.map(({ bcCd, mv }) => ({
                                      bcCd,
                                      mv,
                                  }))
                                : state.activeProfilesMap[fileName]!.coefG7,
                        coefCustom: [],
                    },
                },
            };
        }),
    deleteProfile: (fileName, newProfileListServerData) => {
        set(state => {
            const updatedActiveProfilesMap = { ...state.activeProfilesMap };

            delete updatedActiveProfilesMap[fileName];

            const newFileList = state.fileList.filter(el => el !== fileName);
            return {
                activeProfilesMap: updatedActiveProfilesMap,
                fileList: newFileList,
                activeProfile: newFileList[0],
                profileListServerData: newProfileListServerData,
            };
        });
    },
}));
