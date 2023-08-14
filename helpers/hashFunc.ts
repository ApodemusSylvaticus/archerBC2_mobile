import { Profile } from '@/interface/profile';

export const calculateProfileHash = (profile: Profile) => {
    const profileJson = JSON.stringify(profile);
    /*
    const digest = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.MD5, profileJson);
*/
    return profileJson;
};
