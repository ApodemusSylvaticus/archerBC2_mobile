import React, { useEffect, useMemo, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Container, Row, VelocityTextWrapper, WrapRow } from '@/components/envParamCard/style';
import { TemperatureSVG } from '@/components/svg/temperature';
import { NumericInput } from '@/components/Inputs/numericInput';
import { HumiditySVG } from '@/components/svg/humidity';
import { PressureSVG } from '@/components/svg/pressure';
import { BulletWithTempSVG } from '@/components/svg/bulletWithTemp';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { useDevStatusStore } from '@/store/useDevStatusStore';
import { CompassSVG } from '@/components/svg/compass';
import { WindSVG } from '@/components/svg/wind';
import { WindDirectionStarSVG } from '@/components/svg/windDirectionStar';
import { ChainBrokenChainSVG, ChainSVG } from '@/components/svg/chain';
import { useGetVelocityParam } from '@/hooks/useGetVelocityParam';
import { Text20, TextSemiBold20 } from '@/components/text/styled';
import { velocityFormula } from '@/helpers/velocityFormula';
import { Loader } from '@/components/loader';
import { degreesFromNumber } from '@/helpers/fromNumberToDeg';
import { BulletSpeedSVG } from '@/components/svg/bulletSpeed';
import { UintText } from '@/components/Inputs/style';

export const WindParamColumn: React.FC = React.memo(() => {
    const { setWindParam, devStatus } = useDevStatusStore(state => ({
        devStatus: state.devStatus,
        setWindParam: state.setWindParam,
    }));
    if (devStatus === null) {
        throw new Error('Missing devStatus');
    }

    const [initialValue, setInitialValue] = useState({
        windSpeed: devStatus.pitch.toString(),
        windDir: devStatus.windDir.toString(),
    });

    const { colors, rem } = useTheme();
    const { windParamSchema } = useValidationSchema();
    const { t } = useTranslation();

    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const rotationParam = useSharedValue(devStatus.windDir);

    const isChanged = (value: typeof initialValue) => {
        if (initialValue.windSpeed !== value.windSpeed) {
            return true;
        }

        if (initialValue.windDir !== value.windDir) {
            return true;
        }

        return false;
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ rotate: `${interpolate(rotationParam.value, [0, 360], [0, 360])}deg` }],
            position: 'absolute',
            top: 0,
            left: 0,
        };
    });

    const rotateBlock = (value: number) => {
        const realValue = degreesFromNumber(value);

        rotationParam.value = withTiming(realValue, {
            duration: 200,
            easing: Easing.linear,
        });
    };

    useEffect(() => {
        if (
            devStatus.windDir.toString() !== initialValue.windDir ||
            devStatus.pitch.toString() !== initialValue.windSpeed
        ) {
            setInitialValue({
                windSpeed: devStatus.pitch.toString(),
                windDir: devStatus.windDir.toString(),
            });
        }

        if (devStatus.windDir !== rotationParam.value) {
            const realValue = degreesFromNumber(devStatus.windDir);

            rotationParam.value = withTiming(realValue, {
                duration: 200,
                easing: Easing.linear,
            });
        }
    }, [devStatus]);

    return (
        <Formik
            validationSchema={windParamSchema}
            initialValues={initialValue}
            enableReinitialize
            onSubmit={value => {
                if (!isChanged(value)) {
                    return;
                }
                const windDir = degreesFromNumber(+value.windDir);
                coreProtobuf.sendWindToServer(windDir, +value.windSpeed);
                setWindParam({ windDir, pitch: +value.windSpeed });
            }}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <Container>
                    <View
                        style={{
                            position: 'relative',
                            width: 300,
                            height: 300,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                        }}>
                        <CompassSVG width={300} height={300} fillColor={colors.primary} />

                        <Animated.View style={animatedStyle}>
                            <Svg
                                width={300}
                                height={300}
                                viewBox="0 0 582 582"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <Path
                                    d="M290.923 144.5L305.756 118.748H297.845V85.9846C313.526 77.1143 313.243 57.5139 297.845 50.3604L297.845 24.1787L305.332 22.1757L306.745 19.3143V2.00295L302.224 -6.64592e-06L298.291 3.00295L294.878 -6.64592e-06H286.532L282.566 3.00295L279.144 -6.64592e-06L274.394 2.14752L274.394 19.3143L275.948 22.1757L284.001 24.1787V50.3604C266.483 57.9431 269.591 78.6881 284.001 85.9846V118.748H276.09L290.923 144.5Z"
                                    fill={colors.cardBg}
                                    stroke={colors.activeTab}
                                    strokeWidth={2}
                                />
                            </Svg>
                        </Animated.View>
                    </View>

                    <Row>
                        <WindSVG height={rem * 3.5} width={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.windSpeed}
                            label={t('shot_conditions_wind_speed')}
                            uint={t('uint_m_dash_s')}
                            background={colors.cardBg}
                            onChangeText={handleChange('windSpeed')}
                            error={errors.windSpeed}
                            touched={touched.windSpeed}
                            onBlur={handleBlur('windSpeed')}
                        />
                    </Row>
                    <Row>
                        <WindDirectionStarSVG height={rem * 3.5} width={rem * 3.5} fillColor={colors.primary} />
                        <NumericInput
                            value={values.windDir}
                            label={t('shot_conditions_wind_direction')}
                            background={colors.cardBg}
                            onChangeText={value => {
                                handleChange('windDir')(value);
                                rotateBlock(+value);
                            }}
                            uint={t('uint_degrees')}
                            error={errors.windDir}
                            touched={touched.windDir}
                            onBlur={handleBlur('windDir')}
                        />
                    </Row>

                    {isValid && isChanged(values) && (
                        <Button onPress={() => isValid && handleSubmit()}>
                            <Text20>{t('default_apply_button')}</Text20>
                        </Button>
                    )}
                </Container>
            )}
        </Formik>
    );
});

export const EnvironmentParam: React.FC = React.memo(() => {
    const { setEnvironmentParam, devStatus } = useDevStatusStore(state => ({
        devStatus: state.devStatus,
        setEnvironmentParam: state.setEnvironmentParam,
    }));

    if (devStatus === null) {
        throw new Error('Missing devStatus');
    }

    const { velocityParam, isLoading, errorMsg } = useGetVelocityParam();
    const { airPress, airHum, airTemp, powderTemp } = devStatus;
    const { colors, rem } = useTheme();
    const { t } = useTranslation();
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const { environmentParamColumnSchema } = useValidationSchema();

    const [isChained, setIsChained] = useState<boolean>(airTemp === powderTemp);

    const [initialValue, setInitialValue] = useState({
        pressure: airPress.toString(),
        humidity: airHum.toString(),
        temperature: airTemp.toString(),
        powderTemperature: powderTemp.toString(),
    });

    useEffect(() => {
        setInitialValue({
            pressure: airPress.toString(),
            humidity: airHum.toString(),
            temperature: airTemp.toString(),
            powderTemperature: powderTemp.toString(),
        });
    }, [airPress, airHum, airTemp, powderTemp]);
    const handleChain = () => {
        setIsChained(true);
    };

    const handleUnChain = () => {
        setIsChained(false);
    };

    const isChanged = (value: typeof initialValue) => {
        if (initialValue.pressure !== value.pressure) {
            return true;
        }

        if (initialValue.humidity !== value.humidity) {
            return true;
        }

        if (initialValue.temperature !== value.temperature) {
            return true;
        }

        if (initialValue.powderTemperature !== value.powderTemperature) {
            return true;
        }
        return false;
    };

    return (
        <Formik
            validationSchema={environmentParamColumnSchema}
            initialValues={initialValue}
            enableReinitialize
            onSubmit={value => {
                if (!isChanged(value)) {
                    return;
                }

                if (initialValue.pressure !== value.pressure) {
                    coreProtobuf.setAirPressureToServer(+value.pressure);
                }

                if (initialValue.powderTemperature !== value.powderTemperature) {
                    coreProtobuf.setPowderTemperatureToServer(+value.powderTemperature);
                }

                if (initialValue.humidity !== value.humidity) {
                    coreProtobuf.setAirHumidityToServer(+value.humidity);
                }

                if (initialValue.temperature !== value.temperature) {
                    coreProtobuf.setAirTempToServer(+value.temperature);
                }

                setEnvironmentParam({
                    airPress: +value.pressure,
                    powderTemp: +value.powderTemperature,
                    airHum: +value.humidity,
                    airTemp: +value.temperature,
                });
            }}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <Container>
                    <Row>
                        <PressureSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.pressure}
                            label={t('profile_pressure')}
                            uint={t('uint_hpa')}
                            background={colors.cardBg}
                            onChangeText={handleChange('pressure')}
                            error={errors.pressure}
                            touched={touched.pressure}
                            onBlur={handleBlur('pressure')}
                        />
                    </Row>
                    <Row>
                        <HumiditySVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.humidity}
                            label={t('profile_humidity')}
                            uint="%"
                            background={colors.cardBg}
                            onChangeText={handleChange('humidity')}
                            error={errors.humidity}
                            touched={touched.humidity}
                            onBlur={handleBlur('humidity')}
                        />
                    </Row>
                    <Row>
                        <TemperatureSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.temperature}
                            label={t('profile_air_temperature')}
                            uint={t('uint_temperature')}
                            background={colors.cardBg}
                            onChangeText={value => {
                                handleChange('temperature')(value);
                                if (isChained) {
                                    handleChange('powderTemperature')(value);
                                }
                            }}
                            error={errors.temperature}
                            touched={touched.temperature}
                            onBlur={handleBlur('temperature')}
                        />
                    </Row>

                    <Row>
                        <BulletWithTempSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.powderTemperature}
                            uint={t('uint_temperature')}
                            label={t('profile_powder_temperature')}
                            disabled={isChained}
                            background={colors.cardBg}
                            onChangeText={handleChange('powderTemperature')}
                            error={errors.powderTemperature}
                            touched={touched.powderTemperature}
                            onBlur={handleBlur('powderTemperature')}>
                            {isChained ? (
                                <ChainSVG
                                    width={rem * 3.5}
                                    height={rem * 3.5}
                                    fillColor={colors.primary}
                                    onPress={handleUnChain}
                                />
                            ) : (
                                <ChainBrokenChainSVG
                                    width={rem * 3.5}
                                    height={rem * 3.5}
                                    fillColor={colors.primary}
                                    onPress={() => {
                                        handleChange('powderTemperature')(values.temperature);
                                        handleChain();
                                    }}
                                />
                            )}
                        </NumericInput>
                    </Row>

                    {isLoading && <Loader size={rem * 2.4} />}
                    {!!errorMsg && (
                        <WrapRow>
                            <Text20>{t('error_failed_calc_mv')}</Text20>

                            <Text20>{errorMsg}</Text20>
                        </WrapRow>
                    )}
                    {!!velocityParam && (
                        <Row>
                            <BulletSpeedSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />
                            <VelocityTextWrapper>
                                <Text20>{t('profile_muzzle_velocity')}</Text20>
                                <TextSemiBold20>
                                    {velocityFormula({
                                        cMuzzleVelocity: velocityParam.cMuzzleVelocity,
                                        powderTemperature: +values.powderTemperature,
                                        cZeroTemperature: velocityParam.cZeroTemperature,
                                        cTCoeff: velocityParam.cTCoeff,
                                    })}
                                </TextSemiBold20>
                                <UintText>{t('uint_m_dash_s')}</UintText>
                            </VelocityTextWrapper>
                        </Row>
                    )}

                    {isValid && isChanged(values) && (
                        <Button onPress={() => isValid && handleSubmit()}>
                            <Text20>{t('default_apply_button')}</Text20>
                        </Button>
                    )}
                </Container>
            )}
        </Formik>
    );
});
