import React from 'react';
import { Container, Img, NameBlock } from '@/components/reticles/reticleTab/style';
import { TextSemiBold24 } from '@/components/text/styled';

interface IReticleTab {
    name: string;
    onPress: () => void;
    bmpImageUrl: string;
}
export const ReticleTab: React.FC<IReticleTab> = ({ name, onPress, bmpImageUrl }) => {
    return (
        <Container onPress={onPress}>
            <NameBlock>
                <TextSemiBold24>{name}</TextSemiBold24>
            </NameBlock>

            <Img
                style={{
                    resizeMode: 'cover',
                }}
                source={{
                    uri: bmpImageUrl,
                    cache: 'reload',
                }}
            />
        </Container>
    );
};
