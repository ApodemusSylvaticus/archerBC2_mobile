import { FILE_NAMES, IDbReticle, IReticle } from '@/interface/reticles';
import { convertFromDb, convertToDB } from '@/helpers/reticles';

export class ReticlesCore {
    private static instance: ReticlesCore;

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
        const reticlesList: string[] = (await reticlesListResponse.json()) ?? [];
        return reticlesList;
    };

    getReticleImages = async (folderName: string) => {
        const reticleImagesResponse = await fetch(`${this.hrefBase}getReticleImages?folderName=${folderName}`);
        const reticleImages: IDbReticle[] = await reticleImagesResponse.json();
        return { name: folderName, data: reticleImages };
    };

    getReticleListImg = async (list: string[]) => {
        const promises = list.map(el => this.getReticleImages(el));
        const reticleData = await Promise.all(promises);
        const folders: { [folderName: string]: IReticle[] } = {};
        reticleData.forEach(el => {
            folders[el.name] = el.data.map(({ fileName, base64Str }) => ({
                fileName: convertFromDb(fileName),
                base64Str,
            }));
        });
        return folders;
    };

    sendFolderToServer = async (folderName: string, reticles: IReticle[]) => {
        const newReticles = reticles.map(el => ({ fileName: convertToDB(el.fileName), base64Str: el.base64Str }));

        await fetch(`${this.hrefBase}uploadReticleImages?folderName=${folderName}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReticles),
        });
    };

    deleteReticleFolder = async (folderName: string) => {
        await fetch(`${this.hrefBase}deleteReticleFolder?folderName=${folderName}`, {
            method: 'DELETE',
        });
    };

    deleteReticle = async (folderName: string, fileName: FILE_NAMES) => {
        await fetch(`${this.hrefBase}deleteReticle?folderName=${folderName}`, {
            method: 'POST',
            body: JSON.stringify([convertToDB(fileName)]),
        });
    };

    replaceReticleFile = async (folderName: string, prev: IReticle, curr: IReticle) => {
        await fetch(`${this.hrefBase}replaceFile?folderName=${folderName}`, {
            method: 'POST',
            body: JSON.stringify({
                originalFileName: convertToDB(prev.fileName),
                originalBase64Str: prev.base64Str,
                newFileName: convertToDB(curr.fileName),
                newBase64Str: curr.base64Str,
            }),
        });
    };
}
