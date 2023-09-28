import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components/native';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { CartridgeForm } from '@/components/forms/cartridgeForm';
import { CartridgeProfileProps } from '@/interface/form';

export const Cartridge: React.FC<CartridgeProfileProps> = ({
    cTCoeff,
    cMuzzleVelocity,
    cZeroTemperature,
    id,
    handleChange,
}) => {
    const { t } = useTranslation();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { colors } = useTheme();

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_cartridge')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <CartridgeForm
                    cartridge={{
                        id,
                        cTCoeff: cTCoeff.toString(),
                        cMuzzleVelocity: cMuzzleVelocity.toString(),
                        cZeroTemperature: cZeroTemperature.toString(),
                    }}
                    onSubmit={value => {
                        handleChange({
                            id: value.id,
                            cZeroTemperature: +value.cZeroTemperature,
                            cTCoeff: +value.cTCoeff,
                            cMuzzleVelocity: +value.cMuzzleVelocity,
                        });
                        setIsEditMode(false);
                    }}
                    labelBg={colors.cardBg}
                    navigation={{ type: 'V2' }}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_muzzle_velocity')}</Text20>
                        <Text20>
                            {cMuzzleVelocity} {t('uint_m_dash_s')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_powder_temperature')}</Text20>
                        <Text20>
                            {cZeroTemperature} {t('uint_temperature')}
                        </Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_ratio')}</Text20>
                        <Text20>
                            {cTCoeff} {t('uint_percent_dash_temperature')}
                        </Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
