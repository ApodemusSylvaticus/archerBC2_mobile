import { TwistDirection } from '@/interface/profile';

export interface IDescription {
    name: string;
    cartridge: string;
    bullet: string;
}

export interface IRiffle {
    calibre: string;
    twistRate: string;
    twistDirection: TwistDirection;
    scopeHeight: string;
}

export interface ICartridge {
    muzzleVelocity: string;
    powderTemperature: string;
    ratio: string;
}

export interface IBullet {
    diameter: string;
    weight: string;
    length: string;
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

export interface SingleProfileType {
    type: BallisticProfileType.SINGLE;
    coefficient: string;
}

export interface Coefficient {
    mv: string;
    bc: string;
}
export interface MultiProfileType {
    type: BallisticProfileType.MULTI;
    coefficient: Coefficient[];
}
