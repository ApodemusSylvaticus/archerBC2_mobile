export interface IProfileCardData {
    profileName: string;
    cartridgeName: string;
    shortNameTop: string;
    shortNameBot: string;
    filePath: string;
}
export interface IProfileListServerData {
    profileDesc: IProfileCardData[];
    activeprofile: number;
}
