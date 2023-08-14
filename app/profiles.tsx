import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { CreateNewProfileModal } from '@/components/modals/createNewProfile';
import { useModalControllerStore } from '@/store/useModalControllerStore';

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});

const CurrProfile: React.FC = () => {
    const openNewProfileModal = useModalControllerStore(state => state.openNewProfileModal);
    return (
        <ScrollView style={{ backgroundColor: 'black' }}>
            <CreateNewProfileModal />
            <Pressable style={[styles.button, styles.buttonOpen]} onPress={openNewProfileModal}>
                <Text style={styles.textStyle}>Show Modal</Text>
            </Pressable>
        </ScrollView>
    );
};

export default CurrProfile;
