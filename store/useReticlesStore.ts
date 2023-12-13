import { create } from 'zustand/esm/index';
import { FILE_NAMES, IReticle } from '@/interface/reticles';
import { testReticles } from '@/constant/testValue';

export interface ReticlesFolders {
    folderList: string[];
    folders: {
        [folderName: string]: IReticle[];
    };
}

interface IUseReticlesStore {
    isTesting: boolean;
    setIsTestMode: (data: boolean) => void;
    reticles: ReticlesFolders;
    setDbData: (data: ReticlesFolders) => void;
    deleteFile: (params: { folderName: string; fileName: FILE_NAMES }) => void;
    addNewFile: (params: { folderName: string; reticle: IReticle }) => void;
    deleteFolder: (folderName: string) => void;
    addNewFolder: (data: { folderName: string; newReticles: IReticle[] }) => void;
    changeFile: (params: { folderName: string; prevState: IReticle; newState: IReticle }) => void;
}

export const useReticlesStore = create<IUseReticlesStore>(set => ({
    reticles: {
        folderList: [],
        folders: {},
    },
    isTesting: false,
    setIsTestMode: data =>
        set(() => {
            return {
                isTesting: data,
                reticles: data
                    ? testReticles.reticlesFolders
                    : {
                          folderList: [],
                          folders: {},
                      },
            };
        }),
    setDbData: data => set({ reticles: data }),
    deleteFile: ({ folderName, fileName }) =>
        set(state => {
            const folder = state.reticles.folders[folderName];

            if (!folder) {
                throw new Error('Missing folder');
            }
            const updatedFolder = folder.filter(reticle => reticle.fileName !== fileName);
            if (updatedFolder.length === 0) {
                const updatedFolders = { ...state.reticles.folders };
                delete updatedFolders[folderName];
                return {
                    reticles: {
                        folderList: state.reticles.folderList.filter(el => el !== folderName),
                        folders: updatedFolders,
                    },
                };
            }
            const updatedFolders = { ...state.reticles.folders, [folderName]: updatedFolder };
            return { reticles: { folderList: state.reticles.folderList, folders: updatedFolders } };
        }),

    addNewFile: ({ folderName, reticle }) =>
        set(state => {
            const folder = state.reticles.folders[folderName];
            if (!folder) {
                throw new Error('Missing folder');
            }

            return {
                reticles: {
                    folderList: state.reticles.folderList,
                    folders: { ...state.reticles.folders, [folderName]: [...folder, reticle] },
                },
            };
        }),
    deleteFolder: folderName =>
        set(state => {
            const updatedFolders = { ...state.reticles.folders };
            delete updatedFolders[folderName];
            const updatedFolderList = state.reticles.folderList.filter(name => name !== folderName);
            return { reticles: { folderList: updatedFolderList, folders: updatedFolders } };
        }),
    addNewFolder: ({ folderName, newReticles }) =>
        set(state => {
            const updatedFolders = {
                ...state.reticles.folders,
                [folderName]: newReticles,
            };
            const updatedFolderList = state.reticles.folderList.includes(folderName)
                ? state.reticles.folderList
                : [...state.reticles.folderList, folderName];

            return { reticles: { folderList: updatedFolderList, folders: updatedFolders } };
        }),
    changeFile: ({ folderName, prevState, newState }) =>
        set(state => {
            const folder = state.reticles.folders[folderName];

            if (!folder) {
                throw new Error('Missing folder');
            }

            const updatedFolder = folder.filter(
                reticle => reticle.fileName !== prevState.fileName && reticle.fileName !== newState.fileName,
            );
            updatedFolder.push(newState);

            const updatedFolders = { ...state.reticles.folders, [folderName]: updatedFolder };
            return { reticles: { folderList: state.reticles.folderList, folders: updatedFolders } };
        }),
}));
