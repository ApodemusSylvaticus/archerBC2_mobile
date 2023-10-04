import protobuf from 'protobufjs';
import { ServerProfile } from '@/interface/profile';
import { Decimals } from '@/constant/decimals';

export class ProfileWorker {
    private static instance: ProfileWorker;

    private hrefBase: string = 'http://localhost:8080/';

    setHrefBase = (data: string) => {
        this.hrefBase = data;
    };

    constructor() {
        if (typeof ProfileWorker.instance === 'object') {
            // eslint-disable-next-line no-constructor-return
            return ProfileWorker.instance;
        }
        ProfileWorker.instance = this;
        // eslint-disable-next-line no-constructor-return
        return this;
    }

    payload: protobuf.Type | undefined;

    loadProto = async () => {
        const protobufRoot = protobuf.parse(
            'syntax = "proto3";\n' +
                '\n' +
                'package profedit;\n' +
                '\n' +
                'import "buf/validate/validate.proto";\n' +
                '\n' +
                'option go_package = "github.com/jaremko/a7p_transfer_example/profedit";\n' +
                '\n' +
                'message Payload {\n' +
                '    Profile profile = 1;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'message CoefRow {\n' +
                '    int32 bc_cd = 1;\n' +
                '    int32 mv = 2;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'enum DType {\n' +
                '    VALUE = 0;\n' +
                '    INDEX = 1;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'message SwPos {\n' +
                '    int32 c_idx = 1;\n' +
                '    int32 reticle_idx = 2;\n' +
                '    int32 zoom = 3;\n' +
                '    int32 distance = 4;\n' +
                '    DType distance_from = 5;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'enum GType {\n' +
                '    G1 = 0;\n' +
                '    G7 = 1;\n' +
                '    CUSTOM = 2;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'enum TwistDir {\n' +
                '    RIGHT = 0;\n' +
                '    LEFT = 1;\n' +
                '}\n' +
                '\n' +
                '\n' +
                'message Profile {\n' +
                '    string profile_name = 1;\n' +
                '    string cartridge_name = 2;\n' +
                '    string bullet_name = 3;\n' +
                '    string short_name_top = 4;\n' +
                '    string short_name_bot = 5;\n' +
                '    string user_note = 6;\n' +
                '    int32 zero_x = 7;\n' +
                '    int32 zero_y = 8;\n' +
                '    int32 sc_height = 9;\n' +
                '    int32 r_twist = 10;\n' +
                '    int32 c_muzzle_velocity = 11;\n' +
                '    int32 c_zero_temperature = 12;\n' +
                '    int32 c_t_coeff = 13;\n' +
                '    int32 c_zero_distance_idx = 14;\n' +
                '    int32 c_zero_air_temperature = 15;\n' +
                '    int32 c_zero_air_pressure = 16;\n' +
                '    int32 c_zero_air_humidity = 17;\n' +
                '    int32 c_zero_w_pitch = 18;\n' +
                '    int32 c_zero_p_temperature = 19;\n' +
                '    int32 b_diameter = 20;\n' +
                '    int32 b_weight = 21;\n' +
                '    int32 b_length = 22;\n' +
                '    TwistDir twist_dir = 23;\n' +
                '    GType bc_type = 24;\n' +
                '    repeated SwPos switches = 25;\n' +
                '    repeated int32 distances = 26;\n' +
                '    repeated CoefRow coef_rows = 27;\n' +
                '    string caliber = 28;\n' +
                '    string device_uuid = 29;\n' +
                '}',
        ).root;
        this.payload = protobufRoot.lookupType('profedit.Payload');
    };

    getFileList = async (): Promise<string[]> => {
        const response = await fetch(`${this.hrefBase}filelist`);

        return response.json();
    };

    getProfile = async (fileName: string): Promise<ServerProfile> => {
        if (this.payload === undefined) {
            throw new Error('TODO ERROR');
        }
        const response = await fetch(`${this.hrefBase}files?filename=${fileName}`);
        const buffer = await response.arrayBuffer();

        const message = this.payload.decode(new Uint8Array(buffer));
        console.log('getProfile message', message);

        return this.payload.toObject(message, { enums: String, defaults: true }).profile;
    };

    deleteFileButton = async (fileName: string) => {
        const response = await fetch(`${this.hrefBase}files?filename=${fileName}`, { method: 'DELETE' });
        console.log('delete response', response);
    };

    saveChanges = async (
        fileName: string,
        {
            bDiameter,
            bulletName,
            shortNameTop,
            shortNameBot,
            profileName,
            cartridgeName,
            scHeight,
            bcType,
            cZeroAirPressure,
            cZeroAirHumidity,
            zeroX,
            cZeroDistanceIdx,
            distances,
            cZeroAirTemperature,
            cZeroTemperature,
            cZeroPTemperature,
            zeroY,
            cZeroWPitch,
            bWeight,
            bLength,
            twistDir,
            rTwist,
            userNote,
            cTCoeff,
            cMuzzleVelocity,
            caliber,
            switches,
            coefRows,
            deviceUuid,
        }: ServerProfile,
    ) => {
        if (this.payload === undefined) {
            throw new Error('TODO error');
        }
        const message = this.payload.create({
            profile: {
                caliber,
                rTwist: rTwist * Decimals.rTwist,
                profileName,
                bcType,
                cZeroAirPressure: cZeroAirPressure * Decimals.cZeroAirPressure,
                cZeroAirHumidity,
                cTCoeff: cTCoeff * Decimals.cTCoeff,
                cZeroDistanceIdx,
                cZeroWPitch: cZeroWPitch * Decimals.cZeroPitch,
                cZeroAirTemperature,
                cZeroTemperature,
                cMuzzleVelocity: cMuzzleVelocity * Decimals.cMuzzleVelocity,
                cZeroPTemperature,
                cartridgeName,
                scHeight,
                shortNameTop,
                switches: switches.map(el => ({ ...el, distance: el.distance * Decimals.distances })),
                shortNameBot,
                distances: distances.map(el => el * Decimals.distances),
                userNote,
                twistDir,
                bWeight: bWeight * Decimals.bWeight,
                bLength: bLength * Decimals.bLength,
                bDiameter: bDiameter * Decimals.bDiameter,
                bulletName,
                zeroY: zeroY * Decimals.zeroY,
                zeroX: zeroX * Decimals.zeroX,
                coefRows: coefRows.map(({ bcCd, mv }) => ({
                    bcCd: bcCd * Decimals.bcCd,
                    mv: mv * Decimals.mv,
                })),
                deviceUuid,
            },
        });

        const buffer = this.payload.encode(message).finish();

        return fetch(`${this.hrefBase}files?filename=${fileName}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-protobuf',
            },
            body: buffer,
        });
    };

    sendNewProfiles(arr: ServerProfile[]) {
        if (this.payload === undefined) {
            throw new Error('TODO error');
        }

        const promises = arr.map(val => {
            const copy: Omit<ServerProfile, 'fileName'> & { fileName?: string } = { ...val };
            delete copy.fileName;
            const message = this.payload!.create({
                profile: {
                    ...copy,
                },
            });

            const buffer = this.payload!.encode(message).finish();
            return fetch(`${this.hrefBase}files?filename=${val.fileName}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/x-protobuf',
                },
                body: buffer,
            });
        });

        return Promise.all(promises);
    }

    serveRefreshList() {
        return fetch(`${this.hrefBase}filelist`, { method: 'POST' });
    }
}
