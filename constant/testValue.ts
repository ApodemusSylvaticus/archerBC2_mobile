import { ActiveProfileMap } from '@/store/useActiveProfileStore';
import { IProfileListServerData } from '@/interface/core/profileProtobuf';
import { DevStatus, ProfileDevStatus } from '@/store/useDevStatusStore';
import { ReticlesFolders } from '@/store/useReticlesStore';
import { ZOOM_DEV_STATUS } from '@/interface/core/coreProtobuf';

interface TestActiveProfile {
    activeProfilesMap: ActiveProfileMap;
    activeProfile: string;
    fileList: string[];
    profileListServerData: IProfileListServerData;
    isTesting: boolean;
}

export const testActiveProfile: TestActiveProfile = {
    isTesting: true,
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
        'third.a7p': {
            deviceUuid: 'asdxzc',
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
            caliber: '3082 Win',
            scHeight: 2.8,
            rTwist: 1.1,
            twistDir: 'LEFT',
            cMuzzleVelocity: 2800,
            cZeroTemperature: 22,
            cTCoeff: 0.18,
            profileName: 'TestPr',
            cartridgeName: 'Federal 308 Win',
            bulletName: 'Nosler AccuBond',
            shortNameTop: 'asdaszx',
            shortNameBot: 'F3asd08',
            fileName: 'third.a7p',
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
    fileList: ['first.a7p', 'second.a7p', 'third.a7p'],
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
            {
                profileName: 'Test',
                cartridgeName: 'Federal 308 Win',
                shortNameTop: 'dsfs',
                shortNameBot: 'sdfsdfsdf',
                filePath: 'third.a7p',
            },
        ],
    },
};

interface TestShotConditional {
    isTesting: boolean;
    devStatus: DevStatus;
    activeProfile: ProfileDevStatus;
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
        zoom: ZOOM_DEV_STATUS.X1,
        windSpeed: 0,
        cant: 0,
    },
    activeProfile: {
        deviceUuid: 'asdxzc',
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
        caliber: '3082 Win',
        scHeight: 2.8,
        rTwist: 1.1,
        twistDir: 'LEFT',
        cMuzzleVelocity: 2800,
        cZeroTemperature: 22,
        cTCoeff: 0.18,
        profileName: 'TestPr',
        cartridgeName: 'Federal 308 Win',
        bulletName: 'Nosler AccuBond',
        shortNameTop: 'asdaszx',
        shortNameBot: 'F3asd08',
        userNote: 'Optimized for precise shots at moderate distances.',
        bDiameter: 0.308,
        bWeight: 165,
        bLength: 1.4,
        bcType: 2,
        zeroX: 0,
        zeroY: 0,
        cZeroDistanceIdx: 2,
        cZeroAirTemperature: 18,
        cZeroAirPressure: 1015,
        cZeroAirHumidity: 45,
        cZeroWPitch: 0,
        cZeroPTemperature: 22,
        distances: [50, 100, 150, 200, 250],
        coefRows: [{ bcCd: 0.4, mv: 3200 }],
    },
};

interface TestReticles {
    reticlesFolders: ReticlesFolders;
    isTesting: boolean;
}

export const testReticles: TestReticles = {
    isTesting: true,
    reticlesFolders: {
        folderList: ['r'],
        folders: {
            r: [
                {
                    fileName: 0,
                    url: 'https://leica-camera.com/sites/default/files/styles/medium_desktop/public/2021-10/PRS-reticle_4a_illuminated_Landscape_Teaser_960x640.png?itok=E0OPacoj',
                },
                {
                    fileName: 2,
                    url: 'https://w7.pngwing.com/pngs/469/722/png-transparent-reticle-computer-icons-fadenkreuz-reticle-telescopic-sight-symbol.png',
                },
            ],
        },
    },
};
