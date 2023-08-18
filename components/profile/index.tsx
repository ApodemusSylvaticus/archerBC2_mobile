import React from 'react';
import { Description } from '@/components/profile/components/description';
import { Rifle } from '@/components/profile/components/rifle';
import { Bullet } from '@/components/profile/components/bullet';
import { Reticles } from '@/components/profile/components/reticles';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { ProfileWithId } from '@/interface/profile';
import { Zeroing } from '@/components/profile/components/zeroing';
import { Cartridge } from '@/components/profile/components/cartridge';

export const Profile: React.FC<ProfileWithId> = ({
    profileName,
    cartridgeName,
    bulletName,
    shortNameBot,
    shortNameTop,
    id,
    caliber,
    bcType,
    bLength,
    bWeight,
    rTwist,
    bDiameter,
    coefG1,
    coefG7,
    coefCustom,
    cTCoeff,
    cZeroAirHumidity,
    cZeroAirTemperature,
    cZeroAirPressure,
    cZeroPTemperature,
    cZeroTemperature,
    cZeroDistanceIdx,
    cZeroWPitch,
    distances,
    zeroY,
    zeroX,
    switches,
    cMuzzleVelocity,
    scHeight,
    twistDir,
    userNote,
    deviceUuid,
}) => {
    console.log(switches, deviceUuid);
    return (
        <DefaultColumnContainer>
            <Rifle scHeight={scHeight} rTwist={rTwist} caliber={caliber} twistDir={twistDir} id={id} />
            <Bullet
                id={id}
                bcType={bcType}
                bDiameter={bDiameter}
                bLength={bLength}
                bWeight={bWeight}
                coefCustom={coefCustom}
                coefG1={coefG1}
                coefG7={coefG7}
            />
            <Cartridge
                id={id}
                cMuzzleVelocity={cMuzzleVelocity}
                cTCoeff={cTCoeff}
                cZeroTemperature={cZeroTemperature}
            />
            <Zeroing
                cZeroPTemperature={cZeroPTemperature}
                id={id}
                zeroX={zeroX}
                zeroY={zeroY}
                cZeroAirHumidity={cZeroAirHumidity}
                cZeroAirPressure={cZeroAirPressure}
                cZeroAirTemperature={cZeroAirTemperature}
                cZeroDistanceIdx={cZeroDistanceIdx}
                cZeroWPitch={cZeroWPitch}
                distances={distances}
            />
            <Reticles />
            <Description
                id={id}
                profileName={profileName}
                shortNameTop={shortNameTop}
                shortNameBot={shortNameBot}
                bulletName={bulletName}
                cartridgeName={cartridgeName}
                userNote={userNote}
            />
        </DefaultColumnContainer>
    );
};
