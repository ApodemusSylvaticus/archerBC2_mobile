export type GType = 'g1' | 'g7' | 'custom';
export type TwistDirection = 'right' | 'left';

export interface Distance {
    distance: number;
}

export interface Reticle {
    reticleIdx: number;
    zoom: number;
}

export interface SwitchPosition {
    cIdx: number;
    distance: Distance;
    distanceFrom: 'index' | 'value';
    reticleIdx: number;
    zoom: number;
}

export interface Coefficient {
    bc: number;
    mv: number;
}

export interface Profile {
    profileName: string;
    cartridgeName: string;
    bulletName: string;
    caliber: string;
    deviceUuid: string;
    shortNameTop: string;
    shortNameBot: string;
    userNote: string;
    zeroX: number;
    zeroY: number;
    distances: Distance[];
    switches: SwitchPosition[];
    scHeight: number;
    rTwist: number;
    twistDir: TwistDirection;
    cMuzzleVelocity: number;
    cZeroTemperature: number;
    cTCoeff: number;
    cZeroDistanceIdx: number;
    cZeroAirTemperature: number;
    cZeroAirPressure: number;
    cZeroAirHumidity: number;
    cZeroWPitch: number;
    cZeroPTemperature: number;
    bDiameter: number;
    bWeight: number;
    bLength: number;
    bcType: GType;
    coefG1: Coefficient[];
    coefG7: Coefficient[];
    coefCustom: Coefficient[];
}
