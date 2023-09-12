import React, { useMemo, useState } from 'react';
import { useTheme } from 'styled-components/native';
import { Formik } from 'formik';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button, Container, Row } from '@/components/envParamCard/style';
import { TemperatureSVG } from '@/components/svg/temperature';
import { NumericInput } from '@/components/Inputs/numericInput';
import { HumiditySVG } from '@/components/svg/humidity';
import { PressureSVG } from '@/components/svg/pressure';
import { BulletWithTempSVG } from '@/components/svg/bulletWithTemp';
import { BcSVG } from '@/components/svg/bc';
import { BulletSpeedSVG } from '@/components/svg/bulletSpeed';
import { CoreProtobuf } from '@/core/coreProtobuf';
import { Text20 } from '@/components/text/styled';
import { useValidationSchema } from '@/hooks/useValidationSchema';
import { useEnvironmentStore } from '@/store/useEnvironment';
import { CompassSVG } from '@/components/svg/compass';
import { WindSVG } from '@/components/svg/wind';
import { WindDirectionStarSVG } from '@/components/svg/windDirectionStar';
import { ChainBrokenChainSVG, ChainSVG } from '@/components/svg/chain';
import { SelectInput } from '@/components/Inputs/select/select';
import { ballisticFunctionList } from '@/constant/data';

export const ParamColumn: React.FC = () => {
    const { colors, rem } = useTheme();
    const { t } = useTranslation();
    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const envProfile = useEnvironmentStore(state => state.envProfile);
    const { environmentParamColumnSchema } = useValidationSchema();

    const realBallisticFunction = 'G7';
    const [actualBallisticFunction, setActualBallisticFunction] = useState(
        ballisticFunctionList.findIndex(el => el === realBallisticFunction),
    );

    const [isChained, setIsChained] = useState<boolean>(true);

    const handleChain = () => {
        setIsChained(true);
    };

    const handleUnChain = () => {
        setIsChained(false);
    };

    const initialValue = envProfile
        ? {
              pressure: envProfile.airPress.toString(),
              humidity: envProfile.airHum.toString(),
              temperature: envProfile.airTemp.toString(),
              powderTemperature: envProfile.powderTemp.toString(),
              bc: '3',
              mv: '700',
          }
        : {
              pressure: '3000',
              humidity: '40',
              temperature: '30',
              powderTemperature: '4',
              bc: '3',
              mv: '700',
          };

    return (
        <Formik
            validationSchema={environmentParamColumnSchema}
            initialValues={initialValue}
            onSubmit={value => {
                coreProtobuf.setAirPressureToServer(+value.pressure);
                coreProtobuf.setPowderTemperatureToServer(+value.powderTemperature);
                coreProtobuf.setAirHumidityToServer(+value.humidity);
                coreProtobuf.setAirTempToServer(+value.temperature);
            }}>
            {({ isValid, handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                <Container>
                    <SelectInput
                        label={t('profile_ballistic_function')}
                        background={colors.cardBg}
                        chosenEl={actualBallisticFunction}
                        list={ballisticFunctionList}
                        setElem={val => setActualBallisticFunction(val)}
                        zIndex={3}
                    />
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

                    <Row>
                        <BulletSpeedSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.mv}
                            label={t('profile_mv')}
                            disabled
                            background={colors.cardBg}
                            onChangeText={handleChange('mv')}
                            uint={t('uint_m_dash_s')}
                            error={errors.mv}
                            touched={touched.mv}
                            onBlur={handleBlur('mv')}
                        />
                    </Row>

                    <Row>
                        <BcSVG width={rem * 3.5} height={rem * 3.5} fillColor={colors.primary} />

                        <NumericInput
                            value={values.bc}
                            label={t('profile_bc')}
                            uint={t('uint_lb_dash_square_in')}
                            background={colors.cardBg}
                            onChangeText={handleChange('bc')}
                            error={errors.bc}
                            touched={touched.bc}
                            onBlur={handleBlur('bc')}
                        />
                    </Row>

                    <Button onPress={() => isValid && handleSubmit()}>
                        <Text20>{t('default_apply_button')}</Text20>
                    </Button>
                </Container>
            )}
        </Formik>
    );
};

export const WindParamColumn: React.FC = () => {
    const { colors, rem } = useTheme();
    const rotationParam = useSharedValue(0);
    const { t } = useTranslation();

    const coreProtobuf = useMemo(() => new CoreProtobuf(), []);
    const envProfile = useEnvironmentStore(state => state.envProfile);
    const { windParamSchema } = useValidationSchema();

    const initialValue = envProfile
        ? {
              windSpeed: envProfile.pitch.toString(),
              windDir: envProfile.windDir.toString(),
          }
        : {
              windSpeed: '20',
              windDir: '0',
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
                coreProtobuf.sendWindToServer(+value.windDir, +value.windSpeed);
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
                        <Text20>{t('default_apply_button')}</Text20>
                    </Button>
                </Container>
            )}
        </Formik>
    );
};
