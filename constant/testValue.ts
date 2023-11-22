import { ActiveProfileMap } from '@/store/useActiveProfileStore';
import { IProfileListServerData } from '@/interface/core/profileProtobuf';
import { DevStatus } from '@/store/useDevStatusStore';
import { ZOOM } from '@/interface/core/coreProtobuf';

interface TestActiveProfile {
    activeProfilesMap: ActiveProfileMap;
    activeProfile: string;
    fileList: string[];
    profileListServerData: IProfileListServerData;
}

export const testActiveProfile: TestActiveProfile = {
    activeProfile: 'first.a7p',
    activeProfilesMap: {
        'first.a7p': {
            deviceUuid: 'abc123',
            switches: [
                {
                    cIdx: 1,
                    distance: 100,
                    distanceFrom: 'muzzle',
                    reticleIdx: 3,
                    zoom: 4,
                },
                {
                    cIdx: 2,
                    distance: 200,
                    distanceFrom: 'muzzle',
                    reticleIdx: 5,
                    zoom: 6,
                },
            ],
            caliber: '6.5mm',
            scHeight: 2.5,
            rTwist: 1.8,
            twistDir: 'RIGHT',
            cMuzzleVelocity: 3000,
            cZeroTemperature: 25,
            cTCoeff: 0.2,
            profileName: 'Long Range Shooter',
            cartridgeName: 'Hornady 6.5mm',
            bulletName: 'ELD Match',
            shortNameTop: 'LRS',
            shortNameBot: 'H65',
            fileName: 'first.a7p',
            userNote: 'Customized for extreme long-range accuracy.',
            bDiameter: 0.264,
            bWeight: 140,
            bLength: 1.2,
            coefG1: [{ bcCd: 0.345, mv: 2800 }],
            coefG7: [{ bcCd: 0.345, mv: 2800 }],
            coefCustom: [{ bcCd: 0.345, mv: 2800 }],
            bcType: 'G1',
            zeroX: 0,
            zeroY: 0,
            cZeroDistanceIdx: 3,
            cZeroAirTemperature: 20,
            cZeroAirPressure: 1013,
            cZeroAirHumidity: 50,
            cZeroWPitch: 0,
            cZeroPTemperature: 25,
            distances: [100, 200, 300, 400, 500],
        },
        'second.a7p': {
            deviceUuid: 'xyz789',
            switches: [
                {
                    cIdx: 1,
                    distance: 50,
                    distanceFrom: 'muzzle',
                    reticleIdx: 2,
                    zoom: 3,
                },
                {
                    cIdx: 2,
                    distance: 100,
                    distanceFrom: 'muzzle',
                    reticleIdx: 4,
                    zoom: 5,
                },
            ],
            caliber: '308 Win',
            scHeight: 2.8,
            rTwist: 1.1,
            twistDir: 'LEFT',
            cMuzzleVelocity: 2800,
            cZeroTemperature: 22,
            cTCoeff: 0.18,
            profileName: 'Mid-Range Hunter',
            cartridgeName: 'Federal 308 Win',
            bulletName: 'Nosler AccuBond',
            shortNameTop: 'MRH',
            shortNameBot: 'F308',
            fileName: 'second.a7p',
            userNote: 'Optimized for precise shots at moderate distances.',
            bDiameter: 0.308,
            bWeight: 165,
            bLength: 1.4,
            coefG1: [{ bcCd: 0.4, mv: 3200 }],
            coefG7: [{ bcCd: 0.4, mv: 3200 }],
            coefCustom: [{ bcCd: 0.4, mv: 3200 }],
            bcType: 'G1',
            zeroX: 0,
            zeroY: 0,
            cZeroDistanceIdx: 2,
            cZeroAirTemperature: 18,
            cZeroAirPressure: 1015,
            cZeroAirHumidity: 45,
            cZeroWPitch: 0,
            cZeroPTemperature: 22,
            distances: [50, 100, 150, 200, 250],
        },
    },
    fileList: ['first.a7p', 'second.a7p'],
    profileListServerData: {
        activeprofile: 0,
        profileDesc: [
            {
                shortNameTop: 'LRS',
                shortNameBot: 'H65',
                profileName: 'Long Range Shooter',
                cartridgeName: 'Hornady 6.5mm',
                filePath: 'first.a7p',
            },
            {
                profileName: 'Mid-Range Hunter',
                cartridgeName: 'Federal 308 Win',
                shortNameTop: 'MRH',
                shortNameBot: 'F308',
                filePath: 'second.a7p',
            },
        ],
    },
};

interface TestShotConditional {
    isTesting: boolean;
    devStatus: DevStatus;
    activeProfile: string;
}
export const testShotConditional: TestShotConditional = {
    isTesting: true,
    devStatus: {
        airPress: 200,
        distance: 300,
        windDir: 30,
        powderTemp: 2,
        charge: 2,
        currProfile: 1,
        airTemp: 2,
        airHum: 3,
        zoom: ZOOM.X1,
        pitch: 0,
        cant: 0,
    },
    activeProfile: 'first.a7p',
};
