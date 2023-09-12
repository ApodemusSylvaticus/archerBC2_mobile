import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DefaultCard, DefaultRow, SeparateRow } from '@/components/container/defaultBox';
import { Text20, TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';
import { WithId } from '@/interface/helper';
import { IBullet } from '@/interface/profile';
import { BulletForm } from '@/components/forms/profileChange/bulletForm';

export const Bullet: React.FC<WithId<IBullet>> = ({
    coefCustom,
    coefG1,
    coefG7,
    bcType,
    id,
    bLength,
    bWeight,
    bDiameter,
}) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const { t } = useTranslation();

    const coefArr = bcType === 'G1' ? coefG1 : coefG7;
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>{t('profile_bullet')}</TextSemiBold24>
                <DefaultButton onPress={() => setIsEditMode(prev => !prev)}>
                    <ButtonText>{isEditMode ? t('default_go_back') : t('default_edit')}</ButtonText>
                </DefaultButton>
            </SeparateRow>

            {isEditMode ? (
                <BulletForm
                    id={id}
                    close={() => setIsEditMode(false)}
                    bWeight={bWeight}
                    bLength={bLength}
                    bDiameter={bDiameter}
                    bcType={bcType}
                    coefG7={coefG7}
                    coefG1={coefG1}
                    coefCustom={coefCustom}
                />
            ) : (
                <>
                    <DefaultRow>
                        <Text20>{t('profile_diameter')}</Text20>
                        <Text20>
                            {bDiameter} {t('uint_inches')}
                        </Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_weight')}</Text20>
                        <Text20>
                            {bWeight} {t('uint_grains')}
                        </Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_length')}</Text20>
                        <Text20>
                            {bLength} {t('uint_inches')}
                        </Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_used_function')}</Text20>
                        <Text20>{bcType}</Text20>
                    </DefaultRow>
                    <DefaultRow>
                        <Text20>{t('profile_coefficients')}</Text20>
                        {coefArr.map((el, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <Text20 key={index}>
                                {t('profile_mv')} {el.mv} {t('uint_m_dash_s')}; {t('profile_bc')} {el.bc}{' '}
                                {t('uint_lb_dash_square_in')}
                            </Text20>
                        ))}
                    </DefaultRow>
                </>
            )}
        </DefaultCard>
    );
};
