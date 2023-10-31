import { TwistDirection } from '@/interface/profile';

export interface IDescriptionForm {
    profileName: string;
    cartridge: string;
    bullet: string;
}

export interface IRiffleForm {
    caliber: string;
    rTwist: string;
    twistDir: TwistDirection;
    scHeight: string;
}

export interface ICartridgeForm {
    cMuzzleVelocity: string;
    cZeroTemperature: string;
    cTCoeff: string;
}

export interface IBulletForm {
    bDiameter: string;
    bWeight: string;
    bLength: string;
}

export enum RANGE {
    SUBSONIC,
    SHORT,
    MIDDLE_RANGE,
    LONG_RANGE,
}

export enum BallisticFunctionType {
    G1,
    G7,
}

export enum BallisticProfileType {
    SINGLE,
    MULTI,
}

export interface CoefficientForm {
    mv: string;
    bcCd: string;
}

export interface IBallisticProfile {
    type: BallisticProfileType;
    G1: { single: string; multi: CoefficientForm[] };
    G7: { single: string; multi: CoefficientForm[] };
}
