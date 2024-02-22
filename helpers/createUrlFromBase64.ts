import * as ExpoFileSystem from 'expo-file-system';

function generateRandomString(length: number = 10): string {
    const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result: string = '';
    for (let i = 0; i < length; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
export async function convertBase64ToBmpFile(base64: string) {
    const directoryPath = `${ExpoFileSystem.cacheDirectory}temporaryConvertedToBmpFile`;

    const newUrl = `${directoryPath}/${generateRandomString()}.bmp`;
    const info = await ExpoFileSystem.getInfoAsync(directoryPath);

    if (info.exists) {
        await ExpoFileSystem.deleteAsync(directoryPath, { idempotent: true });
    }

    await ExpoFileSystem.makeDirectoryAsync(directoryPath, {
        intermediates: true,
    });

    await ExpoFileSystem.writeAsStringAsync(newUrl, base64, {
        encoding: ExpoFileSystem.EncodingType.Base64,
    });
    return newUrl;
}
