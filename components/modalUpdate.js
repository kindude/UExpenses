import { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput } from 'react-native';
import RandomPhrase from '../utils/randomizer';
import { storeData, getData } from '../utils/db';
import uuid from 'react-native-uuid';

const ModalUpdate = ({ modalVisible, toggleModal }) => {
    const [number, onChangeNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, OnDescriptionChange] = useState('');

    useEffect(() => {
        setTitle(RandomPhrase());
    });

    async function saveData(){
        let res;
        await storeData('spendings', [{ id: uuid.v4(), description: description, sum: number }]);
        res = await getData('spendings');
        console.log(JSON.stringify(res));
        toggleModal();
    }

    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={toggleModal}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        {/* Close button (cross) */}
                        <Pressable style={styles.closeButton} onPress={toggleModal}>
                            <AntDesign name="close" size={24} color="black" />
                        </Pressable>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={onChangeNumber}
                            value={number}
                            placeholder="How much have you spent ?"
                            keyboardType="numeric"
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={OnDescriptionChange}
                            value={description}
                            placeholder="Description"
                        />
                        <View style={styles.container}>
                            <Pressable
                                style={[styles.button, styles.buttonSubmit]}
                                onPress={saveData}>
                                <Text style={styles.textStyle}>Update</Text>
                            </Pressable>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={toggleModal}>
                                <Text style={styles.textStyle}>Delete</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

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
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
        textAlign: 'center',
        textTransform: 'uppercase',
        marginBottom: 10,
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
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },

    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20,
    },
    button: {
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        
    },
    buttonSubmit: {
        backgroundColor: '#2196F3',
    },
    buttonClose: {
        backgroundColor: '#FF5733',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});


export default ModalUpdate;