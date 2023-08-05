import React from 'react';
import { ActualLabel, Container, NameBlock, ReticlesMock } from '@/components/reticleTab/style';
import { TextSemiBold16, TextSemiBold20 } from '@/components/text/styled';

interface IReticleTab {
    isActive: boolean;
    name: string;
}
export const ReticleTab: React.FC<IReticleTab> = ({ isActive, name }) => {
    return (
        <Container>
            <NameBlock>
                <TextSemiBold20>{name}</TextSemiBold20>
                {isActive && (
                    <ActualLabel>
                        <TextSemiBold16>Active</TextSemiBold16>
                    </ActualLabel>
                )}
            </NameBlock>

            <ReticlesMock />
        </Container>
    );
};
