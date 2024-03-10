import protobuf from 'protobufjs';
import { Nullable } from '@/interface/helper';

export enum ZOOM_DEV_STATUS {
    X1 = 'ZOOM_X1',
    X2 = 'ZOOM_X2',
    X3 = 'ZOOM_X3',
    X4 = 'ZOOM_X4',
    X6 = 'ZOOM_X6',
}

export enum CMD_TRIGGER {
    'CALIBRATE_ACCEL_GYRO' = 'CALIBRATE_ACCEL_GYRO',
    'LRF_MEASUREMENT' = 'LRF_MEASUREMENT',
}

export enum AGC_MODE {
    'AUTO_1' = 'AUTO_1',
    'AUTO_2' = 'AUTO_2',
}

export enum COLOR_SCHEME {
    SEPIA = 'SEPIA',
    BLACK_HOT = 'BLACK_HOT',
    WHITE_HOT = 'WHITE_HOT',
}

export enum BUTTON_PRESS_STATE {
    MENU_SHORT = 'menu_short',
    MENU_LONG = 'menu_long',
    UP_SHORT = 'up_short',
}

export interface IProtobufMessageTypes {
    ClientPayload: Nullable<protobuf.Type>;
    HostPayload: Nullable<protobuf.Type>;
    SetZoomLevel: Nullable<protobuf.Type>;
    SetColorScheme: Nullable<protobuf.Type>;
    SetAirTemp: Nullable<protobuf.Type>;
    SetDistance: Nullable<protobuf.Type>;
    SetAgcMode: Nullable<protobuf.Type>;
    Command: Nullable<protobuf.Type>;
    CommandResponse: Nullable<protobuf.Type>;
    StatusOk: Nullable<protobuf.Type>;
    StatusError: Nullable<protobuf.Type>;
    SetPowderTemp: Nullable<protobuf.Type>;
    SetAirHumidity: Nullable<protobuf.Type>;
    SetAirPressure: Nullable<protobuf.Type>;
    SetWind: Nullable<protobuf.Type>;
    SetCompassOffset: Nullable<protobuf.Type>;
    SetHoldoff: Nullable<protobuf.Type>;
    ButtonPress: Nullable<protobuf.Type>;
    TriggerCmd: Nullable<protobuf.Type>;
    SetZeroing: Nullable<protobuf.Type>;
    HostDevStatus: Nullable<protobuf.Type>;
    ClientDevStatus: Nullable<protobuf.Type>;
    GetHostDevStatus: Nullable<protobuf.Type>;
    GetHostProfile: Nullable<protobuf.Type>;
}

export type ICommandType =
    | 'setZoom'
    | 'cmdTrigger'
    | 'setZeroing'
    | 'setWind'
    | 'setPowderTemp'
    | 'setHoldoff'
    | 'setDst'
    | 'setMagOffset'
    | 'setAirPress'
    | 'setAirHum'
    | 'setAgc'
    | 'setPallette'
    | 'buttonPress'
    | 'setAirTemp';
export interface ICommandData {
    commandType: ICommandType;
    [key: string]: number | BUTTON_PRESS_STATE | ZOOM_DEV_STATUS | CMD_TRIGGER | COLOR_SCHEME | string;
}

export interface ICoreProtobuf {
    protobufMessageTypes: IProtobufMessageTypes;
    zoomDataToServer: (value: ZOOM_DEV_STATUS) => void;
    cmdTriggerToServer: (value: CMD_TRIGGER) => void;
    sendZeroingToServer: (stateX: number, stateY: number) => void;
    sendWindToServer: (windDirection: number, windSpeed: number) => void;
    setPowderTemperatureToServer: (value: number) => void;
    setHoldOffToServer: (stateX: number, stateY: number) => void;
    setDistanceToServer: (value: number) => void;
    setCompassOffToServer: (value: number) => void;
    setAirPressureToServer: (value: number) => void;
    setAirHumidityToServer: (value: number) => void;
    setAgcModeToServer: (value: AGC_MODE) => void;
    setColorSchemeToServer: (value: COLOR_SCHEME) => void;
    setButtonPressToServer: (value: BUTTON_PRESS_STATE) => void;
    setAirTempToServer: (value: number) => void;
    sendCommandToServer: (value: ICommandData) => void;
    loadProto: () => Promise<void>;
    ws: WebSocket;
}
