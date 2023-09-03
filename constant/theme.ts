export interface ITheme {
    name: string;
    colors: {
        appBg: string;
        cardBg: string;
        primary: string;
        l1ActiveEl: string;
        activeTab: string;
        error: string;
    };
}

export const darkTheme: ITheme = {
    name: 'darkTheme',
    colors: {
        appBg: '#212121',
        cardBg: '#616161',
        primary: '#E0E0E0',
        l1ActiveEl: '#757575',
        activeTab: '#8BC34A',
        error: '#B00020',
    },
};

export const lightTheme: ITheme = {
    name: 'lightTheme',
    colors: {
        appBg: '#FAFAFA',
        cardBg: '#c1e3ff',
        primary: '#153f65',
        l1ActiveEl: '#70bdf2',
        activeTab: '#03131f',
        error: '#B00020',
    },
};

export const lightDark: ITheme = {
    name: 'lightThemeDark',
    colors: {
        appBg: '#F5F5F5',
        cardBg: '#DBDCDE',
        primary: '#4D5359',
        l1ActiveEl: '#C8C9CD',
        activeTab: '#FE7F2D',
        // EE6352
        // 9C6615
        // FE7F2D
        error: '#D32F2F',
    },
};