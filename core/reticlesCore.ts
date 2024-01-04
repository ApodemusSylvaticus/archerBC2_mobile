import * as ExpoFileSystem from 'expo-file-system';
import { unzip, zip } from 'react-native-zip-archive';
import axios from 'axios';
import { IReticle } from '@/interface/reticles';
import { convertFromDb, convertToDB } from '@/helpers/reticles';

export class ReticlesCoreV2 {
    private static instance: ReticlesCoreV2;

    temporaryChangingFilePath = `${ExpoFileSystem.cacheDirectory}tempChangingReticles/`;

    allReticles = 'allReticles';

    private hrefBase: string = '';

    private serverApi: string = '';

    getHrefBase = () => {
        return this.hrefBase;
    };

    getServerApi = () => {
        return this.serverApi;
    };

    setHrefBase = (data: string) => {
        this.serverApi = data;
        this.hrefBase = `http://${data}:8080/`;
    };

    constructor() {
        if (typeof ReticlesCoreV2.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return ReticlesCoreV2.instance;
        }
        ReticlesCoreV2.instance = this;
        // eslint-disable-next-line no-constructor-return
        return this;
    }

    getReticleList = async () => {
        const reticlesListResponse = await fetch(`${this.hrefBase}getReticlesList`);
        const reticlesList: string[] = (await reticlesListResponse.json()) ?? [];
        return reticlesList;
    };

    getReticleImages = async (reticleFileName: string) => {
        const url = `http://192.168.1.128:8080/getReticle?name=${reticleFileName}`;
        const localUri = `${ExpoFileSystem.documentDirectory}${reticleFileName}`;
        const state = await ExpoFileSystem.getInfoAsync(
            'file:///data/user/0/com.apodemusagrarius.archerBC2_mobile/files/allReticles/Gjgf.zip/2.bmp',
        );
        console.log('state', state);
        const downloadResumable = ExpoFileSystem.createDownloadResumable(url, localUri, { cache: false });

        const { uri } = await downloadResumable.downloadAsync();

        // Unzip the file
        const unzipTargetPath = `${ExpoFileSystem.documentDirectory}${this.allReticles}/${reticleFileName}/`;

        const folderInfo = await ExpoFileSystem.getInfoAsync(unzipTargetPath);
        if (folderInfo.exists && folderInfo.isDirectory) {
            const existingFiles = await ExpoFileSystem.readDirectoryAsync(unzipTargetPath);
            await Promise.all(existingFiles.map(file => ExpoFileSystem.deleteAsync(`${unzipTargetPath}${file}`)));
        }
        await unzip(uri, unzipTargetPath);

        // Delete the downloaded zip file
        await ExpoFileSystem.deleteAsync(uri);

        // Read the contents of the unzipped folder
        const files = await ExpoFileSystem.readDirectoryAsync(unzipTargetPath);

        // Filter and set image URIs
        const imageFiles = files
            .filter(file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.bmp'))
            .map(file => `${unzipTargetPath}${file}`);

        return { reticleFileName, data: imageFiles };
    };

    getReticleListImg = async (list: string[]) => {
        const directoryInfo = await ExpoFileSystem.getInfoAsync(
            `${ExpoFileSystem.documentDirectory}${this.allReticles}`,
        );

        const files = await ExpoFileSystem.readDirectoryAsync(`${ExpoFileSystem.documentDirectory}`);
        console.log('directoryInfo', directoryInfo);
        console.log('1 files', files);
        if (directoryInfo.exists && directoryInfo.isDirectory) {
            // Delete the directory if it exists
            await ExpoFileSystem.deleteAsync(`${ExpoFileSystem.documentDirectory}${this.allReticles}`);
        }

        // Create the directory
        await ExpoFileSystem.makeDirectoryAsync(`${ExpoFileSystem.documentDirectory}${this.allReticles}`, {
            intermediates: true,
        });

        const files2 = await ExpoFileSystem.readDirectoryAsync(
            `${ExpoFileSystem.documentDirectory}${this.allReticles}`,
        );

        console.log('2 files', files2);
        const promises = list.map(el => this.getReticleImages(el));
        const reticleData = await Promise.all(promises);
        console.log('reticleData', reticleData);

        const folders: { [folderName: string]: IReticle[] } = {};
        reticleData.forEach(el => {
            folders[el.reticleFileName] = el.data.map(url => ({
                fileName: convertFromDb(url.slice(-5)),
                url,
            }));
        });

        return folders;
    };

    /*    convertBase64ToFile = async (base64: string, filePath: string) => {
        await ExpoFileSystem.writeAsStringAsync(filePath, base64, { encoding: ExpoFileSystem.EncodingType.Base64 });
    }; */

    async sendZipToServer(folderName: string, path: string) {
        const tempDir = `${ExpoFileSystem.cacheDirectory}tempReticles/`;
        const dirInfo = await ExpoFileSystem.getInfoAsync(tempDir);

        if (!dirInfo.exists) {
            await ExpoFileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
        }

        const zipFilePath = `${tempDir}${folderName}`;
        await zip(path, zipFilePath);

        const formData = new FormData();
        formData.append('file', {
            uri: zipFilePath,
            type: 'application/zip',
            name: folderName,
        });

        try {
            const response = await axios.post(`${this.hrefBase}uploadReticleFile`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            console.error('Error uploading file: ', error);
            throw error;
        } finally {
            try {
                await ExpoFileSystem.deleteAsync(tempDir, { idempotent: true });
            } catch (cleanupError) {
                console.error('Error cleaning up: ', cleanupError);
            }
        }
    }

    async firstV(folderName: string, prev: IReticle, curr: IReticle) {
        const folderPath = prev.url.slice(0, -6);
        const newUrl = prev.url.slice(0, -5) + convertToDB(curr.fileName);
        try {
            await ExpoFileSystem.moveAsync({
                from: prev.url,
                to: newUrl,
            });
        } catch (e) {
            console.log('Failed to replace files', e);
            throw e;
        }

        try {
            await this.sendZipToServer(folderName, folderPath);
        } catch (e) {
            await ExpoFileSystem.moveAsync({
                from: newUrl,
                to: prev.url,
            });
            console.log('Failed to send zip, ', e);
            throw e;
        }
    }

    async secondV(folderName: string, prev: IReticle, curr: IReticle) {
        const folderPath = prev.url.slice(0, -6);
        const newUrl = prev.url.slice(0, -5) + convertToDB(curr.fileName);

        try {
            await ExpoFileSystem.moveAsync({
                from: prev.url,
                to: this.temporaryChangingFilePath,
            });
            await ExpoFileSystem.moveAsync({
                from: curr.url,
                to: newUrl,
            });
        } catch (e) {
            console.log('Failed to replace files', e);
            throw e;
        }

        try {
            await this.sendZipToServer(folderName, folderPath);
        } catch (e) {
            await ExpoFileSystem.moveAsync({
                from: this.temporaryChangingFilePath,
                to: prev.url,
            });
            await ExpoFileSystem.deleteAsync(this.temporaryChangingFilePath);

            console.log('Failed to replace files', e);
            throw e;
        }
    }

    async replaceReticles(folderName: string, prev: IReticle, curr: IReticle) {
        console.log(folderName, prev, curr);

        if (prev.url === curr.url) {
            return this.firstV(folderName, prev, curr);
        }
        return this.secondV(folderName, prev, curr);
    }

    async deleteReticle(folderName: string, filePath: string) {
        await ExpoFileSystem.moveAsync({
            from: filePath,
            to: this.temporaryChangingFilePath,
        });
        const folderPath = filePath.slice(0, -6);

        try {
            await this.sendZipToServer(folderName, folderPath);
        } catch (error) {
            // If error, move the file back to its original location
            await ExpoFileSystem.moveAsync({
                from: this.temporaryChangingFilePath,
                to: folderPath,
            });
            throw error;
        }
        // If success, delete file from temporary folder
        await ExpoFileSystem.deleteAsync(this.temporaryChangingFilePath);
    }

    deleteReticleByFolderName = async (folderName: string) => {
        try {
            await fetch(`${this.hrefBase}deleteReticle?name=${encodeURIComponent(folderName)}`, {
                method: 'DELETE',
            });
        } catch (e) {
            console.log('Failed to delete reticles');
            throw e;
        }
        const folderPath = `${ExpoFileSystem.documentDirectory}${this.allReticles}/${folderName}`;

        await ExpoFileSystem.deleteAsync(folderPath);
    };

    async saveActionCreateNewReticalFile(folderName: string, newReticle: IReticle) {
        const folderPath = `${ExpoFileSystem.documentDirectory}${this.allReticles}/${folderName}`;
        const info = await ExpoFileSystem.getInfoAsync(`${folderPath}/${convertToDB(newReticle.fileName)}`);

        if (info.exists) {
            await ExpoFileSystem.moveAsync({
                from: `${folderPath}/${convertToDB(newReticle.fileName)}`,
                to: this.temporaryChangingFilePath,
            });
        }
        await ExpoFileSystem.moveAsync({
            from: newReticle.url,
            to: `${folderPath}/${convertToDB(newReticle.fileName)}`,
        });

        try {
            await this.sendZipToServer(folderName, folderPath);
        } catch (e) {
            console.log('Failed to create new', e);

            if (info.exists) {
                await ExpoFileSystem.moveAsync({
                    from: this.temporaryChangingFilePath,
                    to: `${folderPath}/${convertToDB(newReticle.fileName)}`,
                });
            }
            throw e;
        }
    }

    // TODO: folderEXist
    async createNewReticleFolder(folderName: string, newReticles: IReticle[]) {
        const folderPath = `${ExpoFileSystem.documentDirectory}${this.allReticles}/${folderName}`;
        await ExpoFileSystem.makeDirectoryAsync(folderPath);
        const moveFilePromises = newReticles.map(el => {
            return ExpoFileSystem.moveAsync({ from: el.url, to: `${folderPath}/${convertToDB(el.fileName)}` });
        });
        await Promise.all(moveFilePromises);
        /*
        const files = await ExpoFileSystem.readDirectoryAsync(folderPath);
*/
        await this.sendZipToServer(folderName, folderPath);
        await ExpoFileSystem.deleteAsync(folderPath);
    }
}
