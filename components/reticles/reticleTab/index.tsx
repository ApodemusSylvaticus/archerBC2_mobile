import React from 'react';
import { Container, Img, NameBlock } from '@/components/reticles/reticleTab/style';
import { TextSemiBold24 } from '@/components/text/styled';

interface IReticleTab {
    name: string;
    onPress: () => void;
    bmpImage: string;
}
export const ReticleTab: React.FC<IReticleTab> = ({ name, onPress, bmpImage }) => {
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
                    uri: `data:image/jpeg;base64,${bmpImage}`,
                }}
            />
        </Container>
    );
};
