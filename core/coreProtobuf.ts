import protobuf from 'protobufjs';
import {
    AGC_MODE,
    BUTTON_PRESS_STATE,
    CMD_TRIGGER,
    COLOR_SCHEME,
    ICoreProtobuf,
    IProtobufMessageTypes,
    ZOOM,
} from '@/interface/core/coreProtobuf';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export class CoreProtobuf implements ICoreProtobuf {
    private static instance: CoreProtobuf;

    private ws!: WebSocket;

    setIsLoading!: (bool: boolean) => void;

    setErrorMsg!: (msg: string) => void;

    t!: (data: string) => string;

    actualServerApi: string = '';

    private commandMappings:
        | {
              (): {
                  setZoom: (data: { zoomLevel: ZOOM }) => { setZoom: protobuf.Message<any> };
                  setPallette: (data: { schema: COLOR_SCHEME }) => { setPallette: protobuf.Message<any> };
                  setAirTemp: (data: { temperature: number }) => { setAirTC: protobuf.Message<any> };
                  setDst: (data: { distance: number }) => { setDst: protobuf.Message<any> };
                  setAgc: (data: { agcMode: AGC_MODE }) => { setAgc: protobuf.Message<any> };
                  setPowderTemp: (data: { temperature: number }) => { setPowderTemp: protobuf.Message<any> };
                  setAirHum: (data: { humidity: number }) => { setAirHum: protobuf.Message<any> };
                  setAirPress: (data: { pressure: number }) => { setAirPress: protobuf.Message<any> };
                  setWind: (data: { direction: number; speed: number }) => { setWind: protobuf.Message<any> };
                  setMagOffset: (data: { offset: number }) => { setMagOffset: protobuf.Message<any> };
                  setHoldoff: (data: { x: number; y: number }) => { setHoldoff: protobuf.Message<any> };
                  buttonPress: (data: { button: BUTTON_PRESS_STATE }) => { buttonPress: protobuf.Message<any> };
                  cmdTrigger: (data: { cmd: CMD_TRIGGER }) => { cmdTrigger: protobuf.Message<any> };
                  setZeroing: (data: { x: number; y: number }) => { setZeroing: protobuf.Message<any> };
                  getHostDevStatus: () => { getHostDevStatus: protobuf.Message<any> };
                  getHostProfile: () => { getHostProfile: protobuf.Message<any> };
              };
              [x: string]: (arg0: { commandType: string }) => any;
          }
        | undefined;

    protobufMessageTypes: IProtobufMessageTypes = {
        ClientPayload: null,
        HostPayload: null,
        SetZoomLevel: null,
        SetColorScheme: null,
        SetAirTemp: null,
        SetDistance: null,
        SetAgcMode: null,
        Command: null,
        CommandResponse: null,
        StatusOk: null,
        StatusError: null,
        SetPowderTemp: null,
        SetAirHumidity: null,
        SetAirPressure: null,
        SetWind: null,
        SetCompassOffset: null,
        SetHoldoff: null,
        ButtonPress: null,
        TriggerCmd: null,
        SetZeroing: null,
        HostDevStatus: null,
        ClientDevStatus: null,
        GetHostDevStatus: null,
        GetHostProfile: null,
    };

    setDevStatus: ((data: any) => void) | undefined;

    setActiveProfile: ((data: any) => void) | undefined;

    constructor() {
        if (typeof CoreProtobuf.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return CoreProtobuf.instance;
        }
        CoreProtobuf.instance = this;
        // eslint-disable-next-line no-constructor-return
        return this;
    }

    setSetterParam({
        setIsLoading,
        setErrorMsg,
        setDevStatus,
        setActiveProfile,
        t,
    }: {
        setDevStatus: (data: any) => void;
        setActiveProfile: (data: any) => void;
        setIsLoading: (bool: boolean) => void;
        setErrorMsg: (msg: string) => void;
        t: (data: string) => string;
    }) {
        this.setIsLoading = setIsLoading;
        this.setActiveProfile = setActiveProfile;
        this.setErrorMsg = setErrorMsg;
        this.setDevStatus = setDevStatus;
        this.t = t;
    }

    connect(serverApi: string) {
        if (serverApi === this.actualServerApi) {
            this.setIsLoading(false);
            return;
        }

        if (this.ws) {
            this.ws.close();
        }
        this.setIsLoading(true);
        this.setErrorMsg('');
        this.ws = new WebSocket(`ws://${serverApi}:8085`);
        this.ws.binaryType = 'arraybuffer';
        this.ws.onopen = event => {
            this.actualServerApi = serverApi;
            console.log('WebSocket connection opened:', event);
            this.loadProto().then(() => this.getHostDevStatus());
        };
        this.ws.onerror = event => {
            console.log('WebSocket error:', event);
            this.actualServerApi = '';
            this.setErrorMsg(this.t('error_sc_connection_failed'));
            this.setIsLoading(false);
        };
        this.ws.onclose = event => {
            this.setIsLoading(false);
            this.setErrorMsg(this.t('error_sc_connection_failed'));
            this.actualServerApi = '';
            console.log('WebSocket connection closed:', event);
        };
        this.ws.onmessage = event => this.handleServerMessage(event.data);
    }

    loadProto = async () => {
        /*    const protoResponse = await fetch('assets/demo_protocol.proto');
        const protoText = await protoResponse.text(); */

        const protobufRoot = protobuf.parse(`syntax = "proto3";

package demo_protocol;

message HostPayload {
    HostProfile profile = 1;
    HostDevStatus devStatus = 2;
    CommandResponse response = 3;
}

message ClientPayload {
    ClientDevStatus devStatus = 2;
    Command command = 3;
    CommandResponse response = 4;
}

message CommandResponse {
\toneof oneofCommandResponse {
\t\tStatusOk statusOk = 1;
\t\tStatusError statusErr = 2;
\t}
}

message Command
{
\toneof oneofCommand {
\t\tSetZoomLevel setZoom = 1;
\t\tSetColorScheme setPallette = 2;
\t\tSetAgcMode setAgc = 3;
\t\tSetDistance setDst = 4;
\t\tSetHoldoff setHoldoff = 5;
\t\tSetZeroing setZeroing = 6;
\t\tSetCompassOffset setMagOffset = 7;
\t\tSetAirTemp setAirTC = 8;
\t\tSetAirHumidity setAirHum = 9;
\t\tSetAirPressure setAirPress = 10;
\t\tSetPowderTemp setPowderTemp = 11;
\t\tSetWind setWind = 12;
\t\tButtonPress buttonPress = 13;
\t\tTriggerCmd cmdTrigger = 14;
\t\tGetHostDevStatus getHostDevStatus = 15;
\t\tGetHostProfile getHostProfile = 16;
\t}
}

message StatusOk
{
\tOkStatusCode code = 1;
}

message StatusError
{
\tErrorStatusCode code = 1;
\tstring text = 2;
}

enum OkStatusCode {
\tUNKNOWN_OK_STATUS = 0;
    SUCCESS = 1;
}

enum ErrorStatusCode {
\tUNKNOWN_ERROR_STATUS = 0;
    FAILURE = 1;
\tINVALID_DATA = 2;
}

message SetZoomLevel {
    Zoom zoomLevel = 1;
}
message SetColorScheme {
    ColorScheme scheme = 1;
}
message GetHostDevStatus {
}
message GetHostProfile {
}
message SetAirTemp {
\tint32 temperature = 1; //[-100..100] C°
}
message SetPowderTemp {
    int32 temperature = 1; //[-100..100] C°
}
message SetAirHumidity {
    int32 humidity = 1; //[0..100]%
}
message SetAirPressure {
\tint32 pressure = 1; //[3000..12000] decaPascal
}
message SetWind {
\tint32 direction = 1; //[0..359] °
\tint32 speed = 2; //[0..200] deciMeter per second
}
message SetDistance {
\tint32 distance = 1; //deciMeter
}
message SetAgcMode {
\tAGCMode mode = 1;
}
message SetCompassOffset {
\tint32 offset = 1;  //[-360..360] °
}
message SetHoldoff{
\tint32 x = 1; //x1000 125 increments [-600000..600000] 20500 = 20.5 1x; 41 2x; 61.5 3x etc.
\tint32 y = 2; //x1000 125 increments [-600000..600000]
}
message ButtonPress{
\tButtonEnum buttonPressed = 1;
}
message TriggerCmd{
\tCMDDirect cmd = 1;
}
message SetZeroing{
\tint32 x = 1; //x1000 125 increments [-600000..600000]
\tint32 y = 2; //x1000 125 increments [-600000..600000]
}

message HostDevStatus {
    int32 charge = 1; // Represented as percentage
\tZoom zoom = 2; // zoom multiplier
\tint32 airTemp = 3; //-100..100 C°
\tint32 airHum = 4;\t//0..100%
\tint32 airPress = 5; //3000..12000 decaPascal
\tint32 powderTemp = 6; //-100..100 C°
\tint32 windDir = 7; //0..359 °
\tint32 windSpeed = 8; //0..200 deciMeter per second
\tint32 pitch = 9; //-90..90 °
\tint32 cant = 10; //-90..90 °
\tint32 distance = 11; //deciMeter
\tint32 currentProfile = 12; //profile index
}

message ClientDevStatus {
}

enum ColorScheme {
\tUNKNOWN_COLOR_SHEME = 0;
    SEPIA = 1;
    BLACK_HOT = 2;
    WHITE_HOT = 3;
}

enum AGCMode {
\tUNKNOWN_AGC_MODE = 0;
\tAUTO_1 = 1;
\tAUTO_2 = 2;
}

enum Zoom {
\tUNKNOWN_ZOOM_LEVEL = 0;
\tZOOM_X1 = 1;
\tZOOM_X2 = 2;
\tZOOM_X3 = 3;
\tZOOM_X4 = 4;
\tZOOM_X6 = 5;
}

enum ButtonEnum {
\tUNKNOWN_BUTTON = 0;
\tMENU_SHORT = 1;
\tMENU_LONG = 2;
\tUP_SHORT = 3;
\tUP_LONG = 4;
\tDOWN_SHORT = 5;
\tDOWN_LONG = 6;
\tLRF_SHORT = 7;
\tLRF_LONG = 8;
\tREC_SHORT = 9;
\tREC_LONG = 10;
}

enum CMDDirect {
\tUNKNOWN_CMD_DIRECTION = 0;
\tCALIBRATE_ACCEL_GYRO = 1;
\tLRF_MEASUREMENT = 2;
\tRESET_CM_CLICKS = 3;
}

message CoefRow {
\tint32 bc_cd = 1;
\tint32 mv = 2;
}

enum DType {
\tVALUE = 0;
\tINDEX = 1;
}

message SwPos {
\tint32 c_idx = 1;
\tint32 reticle_idx = 2;
\tint32 zoom = 3;
\tint32 distance = 4;
\tDType distance_from = 5;
}

enum GType {
\tG1 = 0;
\tG7 = 1;
\tCUSTOM = 2;
}

enum TwistDir {
\tRIGHT = 0;
\tLEFT = 1;
}

message HostProfile {
\tstring profile_file_name = 1;
}`).root;

        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const type in this.protobufMessageTypes) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            this.protobufMessageTypes[type] = protobufRoot.lookupType(`demo_protocol.${type}`);
        }

        const protobufEnums = {
            Zoom: null,
            ColorScheme: null,
            AGCMode: null,
            OkStatusCode: null,
            ErrorStatusCode: null,
            ButtonEnum: null,
            CMDDirect: null,
        };
        // eslint-disable-next-line guard-for-in,no-restricted-syntax
        for (const enumType in protobufEnums) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            protobufEnums[enumType] = protobufRoot.lookup(`demo_protocol.${enumType}`);
        }

        this.commandMappings = {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setZoom: (data: { zoomLevel: ZOOM }) => ({
                setZoom: this.protobufMessageTypes.SetZoomLevel!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    zoomLevel: protobufEnums.Zoom.values[data.zoomLevel],
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setPallette: (data: { schema: COLOR_SCHEME }) => ({
                setPallette: this.protobufMessageTypes.SetColorScheme!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    scheme: protobufEnums.ColorScheme.values[data.scheme],
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setAirTemp: (data: { temperature: number }) => ({
                setAirTC: this.protobufMessageTypes.SetAirTemp!.create({
                    temperature: data.temperature,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setDst: (data: { distance: number }) => ({
                setDst: this.protobufMessageTypes.SetDistance!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    distance: data.distance,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setAgc: (data: { agcMode: AGC_MODE }) => ({
                setAgc: this.protobufMessageTypes.SetAgcMode!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    mode: protobufEnums.AGCMode.values[data.agcMode],
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setPowderTemp: (data: { temperature: number }) => ({
                setPowderTemp: this.protobufMessageTypes.SetPowderTemp!.create({
                    temperature: data.temperature,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setAirHum: (data: { humidity: number }) => ({
                setAirHum: this.protobufMessageTypes.SetAirHumidity!.create({
                    humidity: data.humidity,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setAirPress: (data: { pressure: number }) => ({
                setAirPress: this.protobufMessageTypes.SetAirPressure!.create({
                    pressure: data.pressure,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setWind: (data: { direction: number; speed: number }) => ({
                setWind: this.protobufMessageTypes.SetWind!.create({
                    direction: data.direction,
                    speed: data.speed,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setMagOffset: (data: { offset: number }) => ({
                setMagOffset: this.protobufMessageTypes.SetCompassOffset!.create({
                    offset: data.offset,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setHoldoff: (data: { x: number; y: number }) => ({
                setHoldoff: this.protobufMessageTypes.SetHoldoff!.create({
                    x: data.x,
                    y: data.y,
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            buttonPress: (data: { button: BUTTON_PRESS_STATE }) => ({
                buttonPress: this.protobufMessageTypes.ButtonPress!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    buttonPressed: protobufEnums.ButtonEnum.values[data.button],
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            cmdTrigger: (data: { cmd: CMD_TRIGGER }) => ({
                cmdTrigger: this.protobufMessageTypes.TriggerCmd!.create({
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    cmd: protobufEnums.CMDDirect.values[data.cmd],
                }),
            }),
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setZeroing: (data: { x: number; y: number }) => ({
                setZeroing: this.protobufMessageTypes.SetZeroing!.create({
                    x: data.x,
                    y: data.y,
                }),
            }),
            getHostDevStatus: () => ({
                getHostDevStatus: this.protobufMessageTypes.GetHostDevStatus!.create({}),
            }),
            getHostProfile: () => ({
                getHostProfile: this.protobufMessageTypes.GetHostProfile!.create({}),
            }),
        };
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handleServerMessage = data => {
        const hostPayload = this.protobufMessageTypes.HostPayload!.decode(new Uint8Array(data));
        const hostPayloadObject = this.protobufMessageTypes.HostPayload!.toObject(hostPayload, {
            enums: String,
            defaults: true,
        });

        console.log('hostPayloadObject', hostPayloadObject);

        if (hostPayloadObject?.profile?.profileFileName) {
            if (!this.setActiveProfile) {
                throw new Error('Forgot to add method');
            }
            this.setActiveProfile(hostPayloadObject.profile.profileFileName);
        }
        if (hostPayloadObject.devStatus) {
            if (!this.setDevStatus) {
                throw new Error('Forgot to add method');
            }
            this.setIsLoading(false);

            this.setDevStatus(hostPayloadObject.devStatus);
        }
    };

    sendCommandToServer = (commandData: { commandType: string }) => {
        const command = this.commandMappings![commandData.commandType](commandData);

        const clientPayloadObject = { command };

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const errMsg = this.protobufMessageTypes.ClientPayload.verify(clientPayloadObject);

        if (errMsg) {
            console.error(`Validation error: ${errMsg}`);
            return;
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const message = this.protobufMessageTypes.ClientPayload.create(clientPayloadObject);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const buffer = this.protobufMessageTypes.ClientPayload.encode(message).finish();

        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(buffer);
        } else {
            console.warn('WebSocket is not open. Cannot send data.');
        }
    };

    zoomDataToServer(value: ZOOM) {
        const commandData = {
            commandType: 'setZoom',
            zoomLevel: value,
        };
        this.sendCommandToServer(commandData);
    }

    cmdTriggerToServer(value: CMD_TRIGGER) {
        const commandData = {
            commandType: 'cmdTrigger',
            cmd: value,
        };
        this.sendCommandToServer(commandData);
    }

    sendWindToServer(windDirection: number, windSpeed: number) {
        const commandData = {
            commandType: 'setWind',
            direction: windDirection,
            speed: windSpeed,
        };
        this.sendCommandToServer(commandData);
    }

    setPowderTemperatureToServer(value: number) {
        const commandData = {
            commandType: 'setPowderTemp',
            temperature: value,
        };
        this.sendCommandToServer(commandData);
    }

    setHoldOffToServer(stateX: number, stateY: number) {
        const commandData = {
            commandType: 'setHoldoff',
            x: stateX,
            y: stateY,
        };
        this.sendCommandToServer(commandData);
    }

    setDistanceToServer(value: number) {
        const commandData = {
            commandType: 'setDst',
            distance: value,
        };
        this.sendCommandToServer(commandData);
    }

    setCompassOffToServer(value: number) {
        const commandData = {
            commandType: 'setMagOffset',
            offset: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAirPressureToServer(value: number) {
        const commandData = {
            commandType: 'setAirPress',
            pressure: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAirHumidityToServer(value: number) {
        const commandData = {
            commandType: 'setAirHum',
            humidity: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAgcModeToServer(value: AGC_MODE) {
        const commandData = {
            commandType: 'setAgc',
            agcMode: value,
        };
        this.sendCommandToServer(commandData);
    }

    setColorSchemeToServer(value: COLOR_SCHEME) {
        const commandData = {
            commandType: 'setPallette',
            scheme: value,
        };
        this.sendCommandToServer(commandData);
    }

    setButtonPressToServer(value: BUTTON_PRESS_STATE) {
        const commandData = {
            commandType: 'buttonPress',
            scheme: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAirTempToServer(value: number) {
        const commandData = {
            commandType: 'setAirTemp',
            temperature: value,
        };
        this.sendCommandToServer(commandData);
    }

    sendZeroingToServer(stateX: number, stateY: number) {
        const commandData = {
            commandType: 'setZeroing',
            x: stateX,
            y: stateY,
        };
        this.sendCommandToServer(commandData);
    }

    getHostDevStatus() {
        console.log('getHostDevStatus');
        const commandData = {
            commandType: 'getHostDevStatus',
        };
        this.sendCommandToServer(commandData);
    }

    getHostProfile() {
        console.log('getHostProfile');

        const commandData = {
            commandType: 'getHostProfile',
        };
        this.sendCommandToServer(commandData);
    }
}
