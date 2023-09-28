import React, { useMemo, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, ButtonText, Container, Row } from '@/components/envParamCard/style';
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
import { MultiCoefficientWrapper } from '@/components/forms/style';

export const WindParamColumn: React.FC = () => {
    const { setWindParam, devStatus } = useDevStatusStore(state => ({
        devStatus: state.devStatus,
        setWindParam: state.setWindParam,
    }));
    if (devStatus === null) {
        throw new Error('TODO error');
    }

    const { colors, rem } = useTheme();
    const { windParamSchema } = useValidationSchema();
    const { t } = useTranslation();

    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const rotationParam = useSharedValue(devStatus.windDir);

    const initialValue = {
        windSpeed: devStatus.pitch.toString(),
        windDir: devStatus.windDir.toString(),
    };

    const isChanged = (value: typeof initialValue) => {
        if (initialValue.windSpeed !== value.windSpeed) {
            return true;
        }

        if (initialValue.windDir !== value.windDir) {
            return true;
        }

        return false;
    };

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${interpolate(rotationParam.value, [0, 360], [0, 360])}deg` }],
        position: 'absolute',
        top: 0,
        left: 0,
    }));

    const rotateBlock = (value: number) => {
        rotationParam.value = withTiming(value, {
            duration: 200,
            easing: Easing.linear,
        });
    };

    return (
        <Formik
            validationSchema={windParamSchema}
            initialValues={initialValue}
            onSubmit={value => {
                if (!isChanged(value)) {
                    return;
                }

                coreProtobuf.sendWindToServer(+value.windDir, +value.windSpeed);
                setWindParam({ windDir: +value.windDir, pitch: +value.windSpeed });
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

                    <Button onPress={() => isValid && handleSubmit()}>
                        <ButtonText isActive={isValid && isChanged(values)}>{t('default_apply_button')}</ButtonText>
                    </Button>
                </Container>
            )}
        </Formik>
    );
};

export const EnvironmentParam: React.FC = () => {
    const { setEnvironmentParam, devStatus } = useDevStatusStore(state => ({
        devStatus: state.devStatus,
        setEnvironmentParam: state.setEnvironmentParam,
    }));

    if (devStatus === null) {
        throw new Error('TODO error');
    }
    const { airPress, airHum, airTemp, powderTemp } = devStatus;
    const { colors, rem } = useTheme();
    const { t } = useTranslation();
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const { environmentParamColumnSchema } = useValidationSchema();

    const [isChained, setIsChained] = useState<boolean>(airTemp === powderTemp);

    const handleChain = () => {
        setIsChained(true);
    };

    const handleUnChain = () => {
        setIsChained(false);
    };

    const initialValue = {
        pressure: airPress.toString(),
        humidity: airHum.toString(),
        temperature: airTemp.toString(),
        powderTemperature: powderTemp.toString(),
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
            onSubmit={value => {
                if (!isChanged(value)) {
                    return;
                }

                coreProtobuf.setAirPressureToServer(+value.pressure);
                coreProtobuf.setPowderTemperatureToServer(+value.powderTemperature);
                coreProtobuf.setAirHumidityToServer(+value.humidity);
                coreProtobuf.setAirTempToServer(+value.temperature);
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

                    <Button onPress={() => isValid && handleSubmit()}>
                        <ButtonText isActive={isValid && isChanged(values)}>{t('default_apply_button')}</ButtonText>
                    </Button>
                </Container>
            )}
        </Formik>
    );
};

export const StableParam: React.FC = () => {
    const actualProfile = useDevStatusStore(state => state.actualProfile);
    if (actualProfile === null) {
        throw new Error('TODO error');
    }

    const { coefRows, bcType } = actualProfile;

    const initialCoef = coefRows;
    const [coefficients, setCoefficients] = useState(initialCoef);

    const handleChangeMV = (val: string, index: number) => {
        setCoefficients(prevState => prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, mv: +val } : el)));
    };

    const handleChangeBC = (val: string, index: number) => {
        setCoefficients(prevState =>
            prevState.map((el, arrIndex) => (index === arrIndex ? { ...el, bcCd: +val } : el)),
        );
    };

    const { colors } = useTheme();
    const { t } = useTranslation();
    const { mvSchema, bcSchema } = useValidationSchema();

    const isValid = useMemo(() => {
        // eslint-disable-next-line no-restricted-syntax
        for (const item of coefficients) {
            if (!bcSchema.isValidSync(item.bcCd.toString()) || !mvSchema.isValidSync(item.mv.toString())) {
                return false;
            }
        }
        return true;
    }, [bcSchema, coefficients, mvSchema]);

    const isChanged = useMemo(() => {
        for (let i = 0; i < initialCoef.length; i += 1) {
            const prev = initialCoef[i];
            const curr = coefficients[i];

            if (prev.bcCd !== curr.bcCd || prev.mv !== curr.mv) {
                return true;
            }
        }

        return false;
    }, [initialCoef, coefficients]);

    const onButtonPress = () => {
        if (isValid && isChanged) {
            /* empty */
        }
    };

    return (
        <Container>
            <Row>
                <NumericInput
                    value={bcType}
                    label={t('profile_ballistic_function')}
                    disabled
                    background={colors.cardBg}
                    onChangeText={() => undefined}
                    error=""
                    touched={false}
                    onBlur={() => undefined}
                />
            </Row>
            {coefficients.map((el, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <MultiCoefficientWrapper key={index}>
                    <NumericInput
                        uint={t('uint_m_dash_s')}
                        label={t('profile_mv')}
                        value={el.mv.toString()}
                        schema={mvSchema}
                        onChangeText={(val: string) => handleChangeMV(val, index)}
                        onBlur={() => undefined}
                        background={colors.cardBg}
                    />
                    <NumericInput
                        uint={t('uint_lb_dash_square_in')}
                        label={t('profile_bc')}
                        value={el.bcCd.toString()}
                        schema={bcSchema}
                        onChangeText={(val: string) => handleChangeBC(val, index)}
                        onBlur={() => undefined}
                        background={colors.cardBg}
                    />
                </MultiCoefficientWrapper>
            ))}
            <Button onPress={onButtonPress}>
                <ButtonText isActive={isValid && isChanged}>{t('default_apply_button')}</ButtonText>
            </Button>
        </Container>
    );
};
