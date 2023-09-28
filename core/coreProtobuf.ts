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

    constructor(setMsg?: (data: any) => void, getActualProfile?: (data: any) => void) {
        if (typeof CoreProtobuf.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return CoreProtobuf.instance;
        }
        CoreProtobuf.instance = this;
        if (setMsg) {
            this.ws = new WebSocket('ws://localhost:8085');
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = event => {
                console.log('WebSocket connection opened:', event);
                this.loadProto();
            };
            this.ws.onerror = event => console.error('WebSocket error:', event);
            this.ws.onclose = event => console.log('WebSocket connection closed:', event);
            this.ws.onmessage = event => this.handleServerMessage(event.data, setMsg, getActualProfile);
            // eslint-disable-next-line no-constructor-return
            return this;
        }
        throw new Error('setMsg === undefined');
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
    ClientProfile profile = 1;
    ClientDevStatus devStatus = 2;
    Command command = 3;
    CommandResponse response = 4;
}

message CommandResponse {
    oneof oneofCommandResponse {
        StatusOk statusOk = 1;
        StatusError statusErr = 2;
    }
}

message Command
{
    oneof oneofCommand {
        SetZoomLevel setZoom = 1;
        SetColorScheme setPallette = 2;
        SetAgcMode setAgc = 3;
        SetDistance setDst = 4;
        SetHoldoff setHoldoff = 5;
        SetZeroing setZeroing = 6;
        SetCompassOffset setMagOffset = 7;
        SetAirTemp setAirTC = 8;
        SetAirHumidity setAirHum = 9;
        SetAirPressure setAirPress = 10;
        SetPowderTemp setPowderTemp = 11;
        SetWind setWind = 12;
        ButtonPress buttonPress = 13;
        TriggerCmd cmdTrigger = 14;
        GetHostDevStatus getHostDevStatus = 15;
        GetHostProfile getHostProfile = 16;
    }
}

message StatusOk
{
    OkStatusCode code = 1;
}

message StatusError
{
    ErrorStatusCode code = 1;
    string text = 2;
}

enum OkStatusCode {
    UNKNOWN_OK_STATUS = 0;
    SUCCESS = 1;
}

enum ErrorStatusCode {
    UNKNOWN_ERROR_STATUS = 0;
    FAILURE = 1;
    INVALID_DATA = 2;
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
    int32 temperature = 1; //[-100..100] C°
}
message SetPowderTemp {
    int32 temperature = 1; //[-100..100] C°
}
message SetAirHumidity {
    int32 humidity = 1; //[0..100]%
}
message SetAirPressure {
    int32 pressure = 1; //[3000..12000] decaPascal
}
message SetWind {
    int32 direction = 1; //[0..359] °
    int32 speed = 2; //[0..200] deciMeter per second
}
message SetDistance {
    int32 distance = 1; //deciMeter
}
message SetAgcMode {
    AGCMode mode = 1;
}
message SetCompassOffset {
    int32 offset = 1;  //[-360..360] °
}
message SetHoldoff{
    int32 x = 1; //x1000 125 increments [-600000..600000] 20500 = 20.5 1x; 41 2x; 61.5 3x etc.
    int32 y = 2; //x1000 125 increments [-600000..600000]
}
message ButtonPress{
    ButtonEnum buttonPressed = 1;
}
message TriggerCmd{
    CMDDirect cmd = 1;
}
message SetZeroing{
    int32 x = 1; //x1000 125 increments [-600000..600000]
    int32 y = 2; //x1000 125 increments [-600000..600000]
}

message HostDevStatus {
    int32 charge = 1; // Represented as percentage
    Zoom zoom = 2; // zoom multiplier
    int32 airTemp = 3; //-100..100 C°
    int32 airHum = 4;\t//0..100%
    int32 airPress = 5; //3000..12000 decaPascal
    int32 powderTemp = 6; //-100..100 C°
    int32 windDir = 7; //0..359 °
    int32 windSpeed = 8; //0..200 deciMeter per second
    int32 pitch = 9; //-90..90 °
    int32 cant = 10; //-90..90 °
    int32 distance = 11; //deciMeter
    int32 currentProfile = 12; //profile index
}

message ClientDevStatus {
}

enum ColorScheme {
    UNKNOWN_COLOR_SHEME = 0;
    SEPIA = 1;
    BLACK_HOT = 2;
    WHITE_HOT = 3;
}

enum AGCMode {
    UNKNOWN_AGC_MODE = 0;
    AUTO_1 = 1;
    AUTO_2 = 2;
}

enum Zoom {
    UNKNOWN_ZOOM_LEVEL = 0;
    ZOOM_X1 = 1;
    ZOOM_X2 = 2;
    ZOOM_X3 = 3;
    ZOOM_X4 = 4;
    ZOOM_X6 = 5;
}

enum ButtonEnum {
    UNKNOWN_BUTTON = 0;
    MENU_SHORT = 1;
    MENU_LONG = 2;
    UP_SHORT = 3;
    UP_LONG = 4;
    DOWN_SHORT = 5;
    DOWN_LONG = 6;
    LRF_SHORT = 7;
    LRF_LONG = 8;
    REC_SHORT = 9;
    REC_LONG = 10;
}

enum CMDDirect {
    UNKNOWN_CMD_DIRECTION = 0;
    CALIBRATE_ACCEL_GYRO = 1;
    LRF_MEASUREMENT = 2;
    RESET_CM_CLICKS = 3;
}

message CoefRow {
    int32 bc_cd = 1;
    int32 mv = 2;
}

enum DType {
    VALUE = 0;
    INDEX = 1;
}

message SwPos {
    int32 c_idx = 1;
    int32 reticle_idx = 2;
    int32 zoom = 3;
    int32 distance = 4;
    DType distance_from = 5;
}

enum GType {
    G1 = 0;
    G7 = 1;
    CUSTOM = 2;
}

enum TwistDir {
    RIGHT = 0;
    LEFT = 1;
}

message HostProfile {
    string profile_name = 1;
    string cartridge_name = 2;
    string bullet_name = 3;
    string short_name_top = 4;
    string short_name_bot = 5;
    string user_note = 6;
    int32 zero_x = 7;
    int32 zero_y = 8;
    int32 sc_height = 9;
    int32 r_twist = 10;
    int32 c_muzzle_velocity = 11;
    int32 c_zero_temperature = 12;
    int32 c_t_coeff = 13;
    int32 c_zero_distance_idx = 14;
    int32 c_zero_air_temperature = 15;
    int32 c_zero_air_pressure = 16;
    int32 c_zero_air_humidity = 17;
    int32 c_zero_w_pitch = 18;
    int32 c_zero_p_temperature = 19;
    int32 b_diameter = 20;
    int32 b_weight = 21;
    int32 b_length = 22;
    TwistDir twist_dir = 23;
    GType bc_type = 24;
    repeated SwPos switches = 25;
    repeated int32 distances = 26;
    repeated CoefRow coef_rows = 27;
    string caliber = 28;
    string device_uuid = 29;
}

message ClientProfile {
    reserved 1, 2, 3;
    reserved "profile_name", "cartridge_name", "bullet_name";
    string short_name_top = 4;
    string short_name_bot = 5;
    string user_note = 6;
    int32 zero_x = 7;
    int32 zero_y = 8;
    int32 sc_height = 9;
    int32 r_twist = 10;
    int32 c_muzzle_velocity = 11;
    int32 c_zero_temperature = 12;
    int32 c_t_coeff = 13;
    int32 c_zero_distance_idx = 14;
    int32 c_zero_air_temperature = 15;
    int32 c_zero_air_pressure = 16;
    int32 c_zero_air_humidity = 17;
    int32 c_zero_w_pitch = 18;
    int32 c_zero_p_temperature = 19;
    int32 b_diameter = 20;
    int32 b_weight = 21;
    int32 b_length = 22;
    TwistDir twist_dir = 23;
    GType bc_type = 24;
    repeated SwPos switches = 25;
    repeated int32 distances = 26;
    repeated CoefRow coef_rows = 27;
    string caliber = 28;
    string device_uuid = 29;
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
        this.getHostProfile();
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handleServerMessage = (data, setMsg, getActualProfile) => {
        const hostPayload = this.protobufMessageTypes.HostPayload!.decode(new Uint8Array(data));
        const hostPayloadObject = this.protobufMessageTypes.HostPayload!.toObject(hostPayload, {
            enums: String,
            defaults: true,
        });

        if (hostPayloadObject.profile) {
            getActualProfile(hostPayloadObject.profile);
        }
        if (hostPayloadObject.devStatus) {
            setMsg(hostPayloadObject.devStatus);
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
        // windDirection (0 - 718); windSpeed (0 - 400)
        const commandData = {
            commandType: 'setWind',
            direction: windDirection,
            speed: windSpeed,
        };
        this.sendCommandToServer(commandData);
    }

    setPowderTemperatureToServer(value: number) {
        // value (-100 - 200)
        const commandData = {
            commandType: 'setPowderTemp',
            temperature: value,
        };
        this.sendCommandToServer(commandData);
    }

    setHoldOffToServer(stateX: number, stateY: number) {
        // stateX (-600000 - 600000), stateY (-600000 - 600000)

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
        // value (-360 - 720)
        const commandData = {
            commandType: 'setMagOffset',
            offset: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAirPressureToServer(value: number) {
        // value (3000 - 12000)
        const commandData = {
            commandType: 'setAirPress',
            pressure: value,
        };
        this.sendCommandToServer(commandData);
    }

    setAirHumidityToServer(value: number) {
        // value (0 - 150)
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
        // value (-100 - 150)
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

    getHostProfile() {
        const commandData = {
            commandType: 'getHostProfile',
        };
        this.sendCommandToServer(commandData);
    }

    getHostDevStatus() {
        const commandData = {
            commandType: 'getHostDevStatus',
        };
        this.sendCommandToServer(commandData);
    }
}
