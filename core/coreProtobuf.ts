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

    constructor(setMsg?: (data: any) => void) {
        if (typeof CoreProtobuf.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return CoreProtobuf.instance;
        }
        CoreProtobuf.instance = this;
        if (setMsg) {
            this.ws = new WebSocket('ws://localhost:8085');
            this.ws.binaryType = 'arraybuffer';
            this.ws.onopen = event => console.log('WebSocket connection opened:', event);
            this.ws.onerror = event => console.error('WebSocket error:', event);
            this.ws.onclose = event => console.log('WebSocket connection closed:', event);
            this.ws.onmessage = event => this.handleServerMessage(event.data, setMsg);
            // eslint-disable-next-line no-constructor-return
            return this;
        }
        throw new Error('setMsg === undefined');
    }

    loadProto = async () => {
        const protoResponse = await fetch('assets/demo_protocol.proto');
        const protoText = await protoResponse.text();
        const protobufRoot = protobuf.parse(protoText).root;

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
    handleServerMessage = (data, setMsg) => {
        const hostPayload = this.protobufMessageTypes.HostPayload!.decode(new Uint8Array(data));
        const hostPayloadObject = this.protobufMessageTypes.HostPayload!.toObject(hostPayload, {
            enums: String,
            defaults: true,
        });
        console.log('hostPayloadObject', hostPayloadObject);

        setMsg(hostPayloadObject);
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
}
