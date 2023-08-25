import React from 'react';
import { Button, ScrollView } from 'react-native';
import { useModalControllerStore } from '@/store/useModalControllerStore';

const CurrProfile: React.FC = () => {
    const { open } = useModalControllerStore(state => ({
        isPixelEditorOpen: state.isPixelEditorOpen,
        open: state.openPixelEditor,
    }));
    return (
        <ScrollView>
            <Button title="Open modal" onPress={open} />

            {/*
            <WebPixelEditor />
*/}

            {/*
            <Profile />
*/}
        </ScrollView>
    );
};

export default CurrProfile;
