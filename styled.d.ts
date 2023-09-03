import 'styled-components/native';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        rem: number;
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
}
