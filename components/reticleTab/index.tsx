import React from 'react';
import { ActualLabel, Container, NameBlock, ReticlesMock, SemiBold16, SemiBold20 } from '@/components/reticleTab/style';

interface IReticleTab {
    isActive: boolean;
    name: string;
}
export const ReticleTab: React.FC<IReticleTab> = ({ isActive, name }) => {
    return (
        <Container>
            <NameBlock>
                <SemiBold20>{name}</SemiBold20>
                {isActive && (
                    <ActualLabel>
                        <SemiBold16>Active</SemiBold16>
                    </ActualLabel>
                )}
            </NameBlock>

            <ReticlesMock />
        </Container>
    );
};
