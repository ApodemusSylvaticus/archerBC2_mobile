export interface ITheme {
    name: string;
    colors: {
        transparent: 'transparent';
        appBg: string;
        cardBg: string;
        primary: string;
        l1ActiveEl: string;
        activeTab: string;
        error: string;
        warn: string;
        success: string;
    };
}

export const darkTheme: ITheme = {
    name: 'darkTheme',
    colors: {
        transparent: 'transparent',
        appBg: '#212121',
        cardBg: '#616161',
        primary: '#E0E0E0',
        l1ActiveEl: '#868787',
        activeTab: '#8BC34A',
        error: '#B00020',
        warn: '#FE7F2D',
        success: '#8BC34A',
    },
};

export const lightTheme: ITheme = {
    name: 'lightTheme',
    colors: {
        transparent: 'transparent',
        appBg: '#FAFAFA',
        cardBg: '#c1e3ff',
        primary: '#153f65',
        l1ActiveEl: '#70bdf2',
        activeTab: '#03131f',
        error: '#B00020',
        warn: '#FE7F2D',
        success: '#8BC34A',
    },
};

export const lightDark: ITheme = {
    name: 'lightThemeDark',
    colors: {
        transparent: 'transparent',
        appBg: '#F5F5F5',
        cardBg: '#DBDCDE',
        primary: '#4D5359',
        l1ActiveEl: '#C8C9CD',
        activeTab: '#FE7F2D',
        // EE6352
        // 9C6615
        // FE7F2D
        error: '#D32F2F',
        warn: '#FE7F2D',
        success: '#8BC34A',
    },
};
