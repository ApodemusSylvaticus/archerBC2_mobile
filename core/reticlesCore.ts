import * as ExpoFileSystem from 'expo-file-system';
import { unzip, zip } from 'react-native-zip-archive';
import axios from 'axios';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { convertFromDb, convertToDB } from '@/helpers/reticles';

export class ReticlesCore {
    private static instance: ReticlesCore;

    temporaryChangingFilePath = `${ExpoFileSystem.cacheDirectory}tempChangingReticles/`;

    allReticles = 'allReticles';

    separator = '_separator_';

    private hrefBase: string = '';

    private serverApi: string = '';

    getServerApi = () => {
        return this.serverApi;
    };

    setHrefBase = (data: string) => {
        this.serverApi = data;
        this.hrefBase = `http://${data}:8080/`;
    };

    constructor() {
        if (typeof ReticlesCore.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return ReticlesCore.instance;
        }
        ReticlesCore.instance = this;
        // eslint-disable-next-line no-constructor-return
        return this;
    }

    getReticleList = async () => {
        const reticlesListResponse = await fetch(`${this.hrefBase}getReticlesList`);
        console.log(await reticlesListResponse.json());
        const reticlesList: string[] = (await reticlesListResponse.json()) ?? [];
        return reticlesList;
    };

    createUrlFromFileName(folderName: string, fileName: FILE_NAMES) {
        return `${this.getFolderPath(folderName)}/${convertToDB(fileName)}${this.separator}${new Date().getTime()}.bmp`;
    }

    getFolderPath(folderName: string) {
        return `${ExpoFileSystem.documentDirectory}${this.allReticles}/${folderName}`;
    }

    extractOriginalFilePath(str: string) {
        const parts = str.split(this.separator);

        if (parts.length === 2) {
            const secondPart = parts[1].split('.');
            if (secondPart.length > 1) {
                return `${parts[0]}.${secondPart.pop()}`;
            }
        }

        return str;
    }

    extractOriginalReticleName(str: string) {
        const parts = str.split(this.separator);

        return convertFromDb(parts[0].slice(-1));
    }

    getReticleImages = async (reticleFileName: string) => {
        const url = `http://192.168.1.128:8080/getReticle?name=${reticleFileName}`;
        const localUri = `${ExpoFileSystem.documentDirectory}${reticleFileName}`;

        const downloadResumable = ExpoFileSystem.createDownloadResumable(url, localUri, { cache: false });

        // TODO  CHECK
        const { uri } = (await downloadResumable.downloadAsync()) as ExpoFileSystem.FileSystemDownloadResult;

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

        // Generate a timestamp
        const timestamp = new Date().getTime();

        // Filter, rename and set image URIs
        const imageFiles = [];
        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            if (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.bmp')) {
                const fileExtension = file.split('.');
                const newFileName = `${fileExtension[0]}${this.separator}${timestamp}.${fileExtension[1]}`;
                // eslint-disable-next-line no-await-in-loop
                await ExpoFileSystem.moveAsync({
                    from: `${unzipTargetPath}${file}`,
                    to: `${unzipTargetPath}${newFileName}`,
                });
                imageFiles.push(`${unzipTargetPath}${newFileName}`);
            }
        }

        return { reticleFileName, data: imageFiles };
    };

    getReticleListImg = async (list: string[]) => {
        const directoryInfo = await ExpoFileSystem.getInfoAsync(
            `${ExpoFileSystem.documentDirectory}${this.allReticles}`,
        );

        if (directoryInfo.exists && directoryInfo.isDirectory) {
            await ExpoFileSystem.deleteAsync(`${ExpoFileSystem.documentDirectory}${this.allReticles}`);
        }

        await ExpoFileSystem.makeDirectoryAsync(`${ExpoFileSystem.documentDirectory}${this.allReticles}`, {
            intermediates: true,
        });

        const promises = list.map(el => this.getReticleImages(el));
        const reticleData = await Promise.all(promises);

        const folders: { [folderName: string]: IReticle[] } = {};
        reticleData.forEach(el => {
            folders[el.reticleFileName] = el.data.map(url => ({
                fileName: this.extractOriginalReticleName(url),
                url,
            }));
        });

        return folders;
    };

    async sendZipToServer(folderName: string, path: string) {
        const tempDir = `${ExpoFileSystem.cacheDirectory}tempReticles/${folderName}`;
        const dirInfo = await ExpoFileSystem.getInfoAsync(tempDir);

        if (!dirInfo.exists) {
            await ExpoFileSystem.makeDirectoryAsync(tempDir, { intermediates: true });
        }

        const files = await ExpoFileSystem.readDirectoryAsync(path);
        // eslint-disable-next-line no-restricted-syntax
        for (const file of files) {
            const sourceFileUri = `${path}/${file}`;
            const destinationFileUri = `${tempDir}/${file[0]}.bmp`;

            // eslint-disable-next-line no-await-in-loop
            await ExpoFileSystem.copyAsync({
                from: sourceFileUri,
                to: destinationFileUri,
            });
        }

        const zipFilePath = `${tempDir}/zip`;
        await zip(tempDir, zipFilePath);

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
        const newUrl = this.createUrlFromFileName(folderName, curr.fileName);
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
            await this.sendZipToServer(folderName, this.getFolderPath(folderName));
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
        const newUrl = this.createUrlFromFileName(folderName, curr.fileName);

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
            await this.sendZipToServer(folderName, this.getFolderPath(folderName));
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
        const folderPath = this.getFolderPath(folderName);

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
        const folderPath = this.getFolderPath(folderName);

        await ExpoFileSystem.deleteAsync(folderPath);
    };

    async saveActionCreateNewReticalFile(folderName: string, newReticle: IReticle) {
        const folderPath = this.getFolderPath(folderName);
        const info = await ExpoFileSystem.readDirectoryAsync(folderPath);

        const filteredInfo = info.filter(el => el[0] === convertToDB(newReticle.fileName));

        const newUrl = this.createUrlFromFileName(folderName, newReticle.fileName);
        let prev: undefined | string;
        if (filteredInfo.length > 0) {
            prev = `${folderPath}/${filteredInfo[0]}`;
            await ExpoFileSystem.moveAsync({
                from: `${folderPath}/${filteredInfo[0]}`,
                to: prev,
            });
        }

        await ExpoFileSystem.moveAsync({
            from: newReticle.url,
            to: newUrl,
        });

        try {
            await this.sendZipToServer(folderName, folderPath);
        } catch (e) {
            console.log('Failed to create new', e);

            if (filteredInfo.length > 0) {
                await ExpoFileSystem.moveAsync({
                    from: this.temporaryChangingFilePath,
                    to: prev!,
                });
            }
            throw e;
        }
    }

    async createNewReticleFolder(folderName: string, newReticles: IReticle[]) {
        const realFolderName = `${folderName}.zip`;
        const folderPath = this.getFolderPath(realFolderName);
        await ExpoFileSystem.makeDirectoryAsync(folderPath);
        const returnedValue: IReticle[] = [];
        const moveFilePromises = newReticles.map(el => {
            const value: IReticle = {
                fileName: el.fileName,
                url: this.createUrlFromFileName(realFolderName, el.fileName),
            };
            returnedValue.push(value);
            return ExpoFileSystem.moveAsync({ from: el.url, to: value.url });
        });
        await Promise.all(moveFilePromises);

        try {
            await this.sendZipToServer(realFolderName, folderPath);
            return returnedValue;
        } catch (e) {
            await ExpoFileSystem.deleteAsync(folderPath);
            throw e;
        }
    }
}
