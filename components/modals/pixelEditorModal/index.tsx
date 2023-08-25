import React from 'react';
import { Modal } from 'react-native';
import { useModalControllerStore } from '@/store/useModalControllerStore';
import { WebPixelEditor } from '@/components/pixelEditor';
import { Container } from '@/components/modals/style';

export const PixelEditorModal: React.FC = () => {
    const { isPixelEditorOpen } = useModalControllerStore(state => ({
        isPixelEditorOpen: state.isPixelEditorOpen,
        close: state.closePixelEditor,
    }));

    return (
        <Modal animationType="slide" visible={isPixelEditorOpen}>
            <Container>
                <WebPixelEditor />
            </Container>
        </Modal>
    );
};
