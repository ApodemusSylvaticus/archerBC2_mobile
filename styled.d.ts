import 'styled-components/native';

// and extend them!
declare module 'styled-components' {
    export interface DefaultTheme {
        rem: number;
        colors: {
            appBg: string;
            cardBg: string;
            primary: string;
            l1ActiveEl: string;
            l2ActiveEl: string;
            activeTab: string;
            secondary: string;
            error: string;
        };
    }
}
