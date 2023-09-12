import { number, object, string } from 'yup';
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export const useValidationSchema = () => {
    const { t } = useTranslation();
    return useMemo(
        () => ({
            bulletSchema: object().shape({
                bDiameter: number()
                    .required(t('default_input_required'))
                    .min(0.001, `${t('default_minimum_value')} - 0.001`)
                    .max(50, `${t('default_maximum_value')} - 50`),
                bWeight: number()
                    .required(t('default_input_required'))
                    .min(1, `${t('default_minimum_value')} - 1`)
                    .max(6553.5, `${t('default_maximum_value')} - 6553.5`),
                bLength: number()
                    .required(t('default_input_required'))
                    .min(0.01, `${t('default_minimum_value')} - 0.01`)
                    .max(200, `${t('default_maximum_value')} - 200`),
            }),
            cartridgeSchema: object().shape({
                cMuzzleVelocity: number()
                    .required(t('default_input_required'))
                    .min(10, `${t('default_minimum_value')} - 10`)
                    .max(3000, `${t('default_maximum_value')} - 3000`),
                cZeroTemperature: number()
                    .required(t('default_input_required'))
                    .min(-100, `${t('default_minimum_value')} - -100`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                cTCoeff: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(5, `${t('default_maximum_value')} - 5`),
            }),
            riffleSchema: object().shape({
                caliber: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
                rTwist: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                scHeight: number()
                    .required(t('default_input_required'))
                    .min(-5000, `${t('default_minimum_value')} - -5000`)
                    .max(5000, `${t('default_maximum_value')} - 5000`),
            }),
            zeroingSchema: object().shape({
                zeroX: number()
                    .required(t('default_input_required'))
                    .min(-200, `${t('default_minimum_value')} - -200`)
                    .max(200, `${t('default_maximum_value')} - 200`),
                zeroY: number()
                    .required(t('default_input_required'))
                    .min(-200, `${t('default_minimum_value')} - -200`)
                    .max(200, `${t('default_maximum_value')} - 200`),
                cZeroWPitch: number()
                    .required(t('default_input_required'))
                    .min(-90, `${t('default_minimum_value')} - -90`)
                    .max(90, `${t('default_maximum_value')} - 90`),
                cZeroDistanceValue: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(3000, `${t('default_maximum_value')} - 3000`),
                cZeroAirTemperature: number()
                    .required(t('default_input_required'))
                    .min(-100, `${t('default_minimum_value')} - -100`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                cZeroAirPressure: number()
                    .required(t('default_input_required'))
                    .min(300, `${t('default_minimum_value')} - 300`)
                    .max(1500, `${t('default_maximum_value')} - 1500`),
                cZeroPTemperature: number()
                    .required(t('default_input_required'))
                    .min(-100, `${t('default_minimum_value')} - -100`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                cZeroAirHumidity: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(100, `${t('default_maximum_value')} - 100`),
            }),

            descriptionSchema: object().shape({
                name: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
                cartridge: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
                bullet: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
            }),

            fullDescriptionSchema: object().shape({
                shortNameBot: string()
                    .required(t('default_input_required'))
                    .max(15, `${t('default_maximum_str_length')} - 15`),
                bulletName: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
                shortNameTop: string()
                    .required(t('default_input_required'))
                    .max(15, `${t('default_maximum_str_length')} - 15`),
                cartridgeName: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
                profileName: string()
                    .required(t('default_input_required'))
                    .max(50, `${t('default_maximum_str_length')} - 50`),
            }),

            bcSchema: number()
                .min(0, `${t('default_minimum_value')} - 0`)
                .max(10, `${t('default_maximum_value')} - 10`),
            mvSchema: number()
                .min(0, `${t('default_minimum_value')} - 0`)
                .max(3000, `${t('default_maximum_value')} - 3000`),

            environmentParamColumnSchema: object().shape({
                temperature: number()
                    .required(t('default_input_required'))
                    .min(-100, `${t('default_minimum_value')} - -100`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                pressure: number()
                    .required(t('default_input_required'))
                    .min(3000, `${t('default_minimum_value')} - 3000`)
                    .max(12000, `${t('default_maximum_value')} - 12000`),
                powderTemperature: number()
                    .required(t('default_input_required'))
                    .min(-100, `${t('default_minimum_value')} - -100`)
                    .max(100, `${t('default_maximum_value')} - 100`),
                humidity: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(100, `${t('default_maximum_value')} - 100`),
            }),

            windParamSchema: object().shape({
                windSpeed: number()
                    .required(t('default_input_required'))
                    .min(0, `${t('default_minimum_value')} - 0`)
                    .max(200, `${t('default_maximum_value')} - 200`),

                windDir: number()
                    .required(t('default_input_required'))
                    .min(-0, `${t('default_minimum_value')} - 0`)
                    .max(359, `${t('default_maximum_value')} - 359`),
            }),
        }),
        [t],
    );
};
