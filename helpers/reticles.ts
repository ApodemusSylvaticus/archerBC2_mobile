import { FILE_NAMES } from '@/interface/reticles';

export const convertFromDb = (data: string): FILE_NAMES => {
    switch (data) {
        case '1.bmp':
            return FILE_NAMES.FIRST;
        case '2.bmp':
            return FILE_NAMES.SECOND;
        case '3.bmp':
            return FILE_NAMES.THIRD;
        case '4.bmp':
            return FILE_NAMES.FOURTH;
        case '6.bmp':
            return FILE_NAMES.SIXTH;
        default:
            throw new Error('convertFromDb error');
    }
};

export const convertToDB = (data: FILE_NAMES): string => {
    switch (data) {
        case FILE_NAMES.FIRST:
            return '1';
        case FILE_NAMES.SECOND:
            return '2';
        case FILE_NAMES.THIRD:
            return '3';
        case FILE_NAMES.FOURTH:
            return '4';
        case FILE_NAMES.SIXTH:
            return '6';
        default:
            throw new Error('convertToDB error');
    }
};

export const convertFromFileNameToString = (data: FILE_NAMES): string => {
    switch (data) {
        case FILE_NAMES.FIRST:
            return 'x1';
        case FILE_NAMES.SECOND:
            return 'x2';
        case FILE_NAMES.THIRD:
            return 'x3';
        case FILE_NAMES.FOURTH:
            return 'x4';
        case FILE_NAMES.SIXTH:
            return 'x6';
        default:
            throw new Error('convertFromFileNameToString error');
    }
};
