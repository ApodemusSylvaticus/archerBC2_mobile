export enum FILE_NAMES {
    FIRST = 0,
    SECOND = 1,
    THIRD = 2,
    FOURTH = 3,
    SIXTH = 4,
}
export interface IReticle {
    fileName: FILE_NAMES;
    url: string;
}

export interface IDbReticle {
    fileName: string;
    url: string;
}
