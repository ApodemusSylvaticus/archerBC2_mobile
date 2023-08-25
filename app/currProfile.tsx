import React from 'react';
import { ScrollView } from 'react-native';
import { WebPixelEditor } from '@/components/pixelEditor';

const CurrProfile: React.FC = () => {
    /*    const { open } = useModalControllerStore(state => ({
        isPixelEditorOpen: state.isPixelEditorOpen,
        open: state.openPixelEditor,
    })); */
    return (
        <ScrollView>
            {/*
            <Button title="Open modal" onPress={open} />
*/}
            <WebPixelEditor />

            {/*
            <Profile />
*/}
        </ScrollView>
    );
};

export default CurrProfile;
