export type GType = 'G1' | 'G7' | 'Custom';
export type TwistDirection = 'RIGHT' | 'LEFT';

export interface Reticle {
    reticleIdx: number;
    zoom: number;
}

export interface SwitchPosition {
    cIdx: number;
    distance: number;
    distanceFrom: string;
    reticleIdx: number;
    zoom: number;
}

export interface Coefficient {
    bcCd: number;
    mv: number;
}

export interface IRiffle {
    caliber: string;
    scHeight: number;
    rTwist: number;
    twistDir: TwistDirection;
}

export interface ICartridge {
    cMuzzleVelocity: number;
    cZeroTemperature: number;
    cTCoeff: number;
}

export interface IDescription {
    profileName: string;
    cartridgeName: string;
    bulletName: string;
    shortNameTop: string;
    shortNameBot: string;
    fileName: string;
    userNote: string;
}

export interface IBullet {
    bDiameter: number;
    bWeight: number;
    bLength: number;
    coefG1: Coefficient[];
    coefG7: Coefficient[];
    coefCustom: Coefficient[];
    bcType: GType;
}

export interface Distances {
    distances: number[];
}

export interface IZeroing extends Distances {
    zeroX: number;
    zeroY: number;
    cZeroDistanceIdx: number;
    cZeroAirTemperature: number;
    cZeroAirPressure: number;
    cZeroAirHumidity: number;
    cZeroWPitch: number;
    cZeroPTemperature: number;
}

export interface Profile extends IRiffle, ICartridge, IDescription, IBullet, IZeroing {
    deviceUuid: string;
    switches: SwitchPosition[];
}

export type ServerProfile = Omit<Profile, 'coefG1' | 'coefG7' | 'coefCustom'> & { coefRows: Coefficient[] };
