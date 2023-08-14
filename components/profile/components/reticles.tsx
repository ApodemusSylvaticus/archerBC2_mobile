import React from 'react';
import { ReticleTab } from '@/components/reticleTab';
import { DefaultCard, SeparateRow } from '@/components/container/defaultBox';
import { TextSemiBold24 } from '@/components/text/styled';
import { DefaultButton } from '@/components/button/style';
import { ButtonText } from '@/components/profile/components/style';

export const Reticles: React.FC = () => {
    return (
        <DefaultCard>
            <SeparateRow>
                <TextSemiBold24>Reticles</TextSemiBold24>
                <DefaultButton>
                    <ButtonText>Select</ButtonText>
                </DefaultButton>
            </SeparateRow>
            <ReticleTab isActive name="Reticle1" />
            <ReticleTab isActive={false} name="Reticle1" />
            <ReticleTab isActive={false} name="Reticle1" />
        </DefaultCard>
    );
};
