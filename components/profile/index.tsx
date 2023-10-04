import React from 'react';
import { Description } from '@/components/profile/components/description';
import { Rifle } from '@/components/profile/components/rifle';
import { Bullet } from '@/components/profile/components/bullet';
import { Reticles } from '@/components/profile/components/reticles';
import { DefaultColumnContainer } from '@/components/container/defaultBox';
import { Zeroing } from '@/components/profile/components/zeroing';
import { Cartridge } from '@/components/profile/components/cartridge';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { IProfileProps } from '@/interface/form';
import { DefaultButton } from '@/components/button/style';
import { TextSemiBold20 } from '@/components/text/styled';

export const Profile: React.FC<IProfileProps> = ({
    isFileNameChangeable,
    profileName,
    cartridgeName,
    bulletName,
    shortNameBot,
    shortNameTop,
    fileName,
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
    cMuzzleVelocity,
    scHeight,
    twistDir,
    userNote,
    setRiffle,
    setZeroing,
    setCartridge,
    setDescription,
    setBullet,
    setDistances,
}) => {
    const openDistanceList = useModalControllerStore(state => state.openDistanceList);
    return (
        <DefaultColumnContainer>
            <Rifle
                handleChange={setRiffle}
                scHeight={scHeight}
                rTwist={rTwist}
                caliber={caliber}
                twistDir={twistDir}
                fileName={fileName}
            />
            <Bullet
                handleChange={setBullet}
                fileName={fileName}
                bcType={bcType}
                bDiameter={bDiameter}
                bLength={bLength}
                bWeight={bWeight}
                coefCustom={coefCustom}
                coefG1={coefG1}
                coefG7={coefG7}
            />
            <Cartridge
                handleChange={setCartridge}
                fileName={fileName}
                cMuzzleVelocity={cMuzzleVelocity}
                cTCoeff={cTCoeff}
                cZeroTemperature={cZeroTemperature}
            />
            <Zeroing
                handleChange={setZeroing}
                cZeroPTemperature={cZeroPTemperature}
                fileName={fileName}
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
                isFileNameChangeable={isFileNameChangeable}
                handleChange={setDescription}
                fileName={fileName}
                profileName={profileName}
                shortNameTop={shortNameTop}
                shortNameBot={shortNameBot}
                bulletName={bulletName}
                cartridgeName={cartridgeName}
                userNote={userNote}
            />

            <DefaultButton onPress={() => openDistanceList(distances, cZeroDistanceIdx, setDistances)}>
                <TextSemiBold20>Open distant list</TextSemiBold20>
            </DefaultButton>
        </DefaultColumnContainer>
    );
};
