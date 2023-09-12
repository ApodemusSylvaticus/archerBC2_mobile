import React, { useState } from 'react';
import { useTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { IRiffle } from '@/interface/profile';
import { WithId } from '@/interface/helper';
import { useProfileStore } from '@/store/useProfileStore';
import { RiffleForm } from '@/components/forms/riffleForm';

export const Rifle: React.FC<WithId<IRiffle>> = ({ scHeight, rTwist, twistDir, caliber, id }) => {
    const { t } = useTranslation();
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const setProfileRifle = useProfileStore(state => state.setProfileRifle);
    const { colors } = useTheme();

    const list = ['left', 'right'] as const;
    const index = list.findIndex(el => el === twistDir);
    const translatedList = [t('profile_twist_direction_left'), t('profile_twist_direction_right')];

    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_riffle')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <RiffleForm
                    riffle={{ caliber, scHeight: scHeight.toString(), twistDir, rTwist: rTwist.toString(), id }}
                    labelBg={colors.cardBg}
                    onSubmit={value => {
                        setProfileRifle({
                            id,
                            rTwist: +value.rTwist,
                            scHeight: +value.scHeight,
                            twistDir: value.twistDir,
                            caliber: value.caliber,
                        });
                        setIsEditMode(false);
                    }}
                    navigation={{ type: 'V2' }}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_caliber')}</Text20>
                        <Text20>{caliber}</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_twist_direction')}</Text20>
                        <Text20>{translatedList[index]}</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_twist_rate')}</Text20>
                        <Text20>{rTwist} inches/turn</Text20>
                    </DefaultRow>

                    <DefaultRow>
                        <Text20>{t('profile_scope_height')}</Text20>
                        <Text20>{scHeight} mm</Text20>
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
