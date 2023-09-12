import { useTranslation } from 'react-i18next';
import { useNewProfileStore } from '@/store/useNewProfileStore';
import { Profile, SwitchPosition } from '@/interface/profile';
import { ballisticFunctionList } from '@/constant/data';
import { BallisticFunctionType, BallisticProfileType } from '@/interface/newProfile';
import { useProfileStore } from '@/store/useProfileStore';
import { calculateProfileHash } from '@/helpers/hashFunc';

const distants: number[][] = [
    [
        25, 50, 75, 100, 110, 120, 130, 140, 150, 155, 160, 165, 170, 175, 180, 185, 190, 195, 200, 205, 210, 215, 220,
        225, 230, 235, 240, 245, 250, 255, 260, 265, 270, 275, 280, 285, 290, 295, 300, 305, 310, 315, 320, 325, 330,
        335, 340, 345, 350, 355, 360, 365, 370, 375, 380, 385, 390, 395, 400,
    ],
    [
        100, 150, 200, 225, 250, 275, 300, 320, 340, 360, 380, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490, 500,
        505, 510, 515, 520, 525, 530, 535, 540, 545, 550, 555, 560, 565, 570, 575, 580, 585, 590, 595, 600, 605, 610,
        615, 620, 625, 630, 635, 640, 645, 650, 655, 660, 665, 670, 675, 680, 685, 690, 695, 700,
    ],
    [
        100, 200, 250, 300, 325, 350, 375, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 610, 620, 630, 640,
        650, 660, 670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 805, 810, 815, 820, 825, 830,
        835, 840, 845, 850, 855, 860, 865, 870, 875, 880, 885, 890, 895, 900, 905, 910, 915, 920, 925, 930, 935, 940,
        945, 950, 955, 960, 965, 970, 975, 980, 985, 990, 995, 1000,
    ],
    [
        100, 200, 250, 300, 350, 400, 420, 440, 460, 480, 500, 520, 540, 560, 580, 600, 610, 620, 630, 640, 650, 660,
        670, 680, 690, 700, 710, 720, 730, 740, 750, 760, 770, 780, 790, 800, 810, 820, 830, 840, 850, 860, 870, 880,
        890, 900, 910, 920, 930, 940, 950, 960, 970, 980, 990, 1000, 1005, 1010, 1015, 1020, 1025, 1030, 1035, 1040,
        1045, 1050, 1055, 1060, 1065, 1070, 1075, 1080, 1085, 1090, 1095, 1100, 1105, 1110, 1115, 1120, 1125, 1130,
        1135, 1140, 1145, 1150, 1155, 1160, 1165, 1170, 1175, 1180, 1185, 1190, 1195, 1200, 1205, 1210, 1215, 1220,
        1225, 1230, 1235, 1240, 1245, 1250, 1255, 1260, 1265, 1270, 1275, 1280, 1285, 1290, 1295, 1300, 1305, 1310,
        1315, 1320, 1325, 1330, 1335, 1340, 1345, 1350, 1355, 1360, 1365, 1370, 1375, 1380, 1385, 1390, 1395, 1400,
        1405, 1410, 1415, 1420, 1425, 1430, 1435, 1440, 1445, 1450, 1455, 1460, 1465, 1470, 1475, 1480, 1485, 1490,
        1495, 1500, 1505, 1510, 1515, 1520, 1525, 1530, 1535, 1540, 1545, 1550, 1555, 1560, 1565, 1570, 1575, 1580,
        1585, 1590, 1595, 1600, 1605, 1610, 1615, 1620, 1625, 1630, 1635, 1640, 1645, 1650, 1655, 1660, 1665, 1670,
        1675, 1680, 1685, 1690, 1695, 1700,
    ],
];

const switches: SwitchPosition[] = [
    { cIdx: 255, distanceFrom: '', distance: 100.0, reticleIdx: 1, zoom: 1 },
    { cIdx: 255, distanceFrom: '', distance: 200.0, reticleIdx: 0, zoom: 2 },
    { cIdx: 255, distanceFrom: '', distance: 300.0, reticleIdx: 0, zoom: 3 },
    { cIdx: 255, distanceFrom: '', distance: 1000.0, reticleIdx: 0, zoom: 4 },
];

export const useConvertProfile = () => {
    const { t } = useTranslation();
    const { ballisticFunction, ballisticProfile, description, riffle, range, bullet, cartridge } = useNewProfileStore(
        state => ({
            ballisticProfile: state.ballisticProfile,
            description: state.description,
            riffle: state.riffle,
            range: state.range,
            cartridge: state.cartridge,
            bullet: state.bullet,
            ballisticFunction: state.ballisticFunction,
        }),
    );
    const addNewProfile = useProfileStore(addNewProfileState => addNewProfileState.addNewProfile);

    const getCoefficient = () => {
        switch (ballisticProfile!.type) {
            case BallisticProfileType.MULTI:
                return ballisticProfile!.coefficient.map(el => ({ mv: +el.mv, bc: +el.bc }));
            case BallisticProfileType.SINGLE:
                return [{ bc: +ballisticProfile!.coefficient, mv: 0 }];
            default:
                return [];
        }
    };
    const convert = (): Profile => {
        return {
            profileName: description.name,
            cartridgeName: description.cartridge,
            bulletName: description.bullet,
            caliber: riffle.caliber,
            deviceUuid: '',
            shortNameTop: description.cartridge.slice(0, 8),
            shortNameBot: description.bullet.slice(0, 8),
            userNote: t('default_add_description'),
            zeroX: 0,
            zeroY: 0,
            distances: distants[range!],
            switches,

            scHeight: +riffle.scHeight,
            rTwist: +riffle.rTwist,
            twistDir: riffle.twistDir,
            cMuzzleVelocity: +cartridge.cMuzzleVelocity,
            cZeroTemperature: +cartridge.cZeroTemperature,
            cTCoeff: +cartridge.cTCoeff,
            cZeroDistanceIdx: 0,

            cZeroAirTemperature: 15,
            cZeroAirPressure: 1000,
            cZeroAirHumidity: 40,
            cZeroWPitch: 0,
            cZeroPTemperature: 15,
            bDiameter: +bullet.bDiameter,
            bWeight: +bullet.bWeight,
            bLength: +bullet.bLength,
            bcType: ballisticFunctionList[ballisticFunction!],
            coefG1: ballisticFunction === BallisticFunctionType.G1 ? getCoefficient() : [],
            coefG7: ballisticFunction === BallisticFunctionType.G7 ? getCoefficient() : [],
            coefCustom: [],
        };
    };

    return () => {
        const convertProfile = convert();
        addNewProfile({ ...convertProfile, id: calculateProfileHash(convertProfile) });
    };
};
