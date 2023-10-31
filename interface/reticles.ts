export enum FILE_NAMES {
    FIRST = 0,
    SECOND = 1,
    THIRD = 2,
    FOURTH = 3,
    SIXTH = 4,
}
export interface IReticle {
    fileName: FILE_NAMES;
    base64Str: string;
}

export interface IDbReticle {
    fileName: string;
    base64Str: string;
}
