import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, Text, Pressable, View, TextInput, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker'; 
import { Picker } from '@react-native-picker/picker'; 

import RandomPhrase from '../utils/randomizer';
import { storeData, getData } from '../utils/db';
import uuid from 'react-native-uuid';
import { updateData, deleteData } from '../utils/db';
import { phrases } from '../utils/phrases';
import calculateCurrency from '../utils/calculateCurrency';

const CustomModal = ({ modalVisible, toggleModal, isUpdate, item, usd, eur }) => {
    const [number, setNumber] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [id, setId] = useState('');
    const [chosenDate, setChosenDate] = useState(new Date());
    const [currency, setCurrency] = useState('£'); 
    const [USD, setUSD] = useState();
    const [EUR, setEUR] = useState();
    useEffect(() => {
        setTitle(RandomPhrase(phrases));
        if (item) {
            setNumber(item.sum.toString());
            setDescription(item.description);
            setDate(item.date);
            setId(item.id);
        } else {
            setNumber('');
            setDescription('');
            setDate('');
            setId('');
        }

        if (usd && eur) {
            setUSD(usd);
            setEUR(eur);
        }
    }, [toggleModal]);

    const handleDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || chosenDate;
        setChosenDate(currentDate);
    };

    const saveData = async () => {
        const rateToPass = currency === '£' ? 1 : currency === '$' ? USD : EUR; 
        const sumN = calculateCurrency(rateToPass, number);
        try {
            await storeData('spendings', [{
                id: uuid.v4(),
                description: description,
                sum: parseFloat(sumN),
                date: chosenDate
            }]);
            toggleModal();
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const updateItem = async () => {
        const rateToPass = currency === '£' ? 1 : currency === '$' ? USD : EUR; 
        const sumN = calculateCurrency(rateToPass, number);
        try {
            await updateData('spendings', id, {
                id: id,
                description: description,
                date: chosenDate,
                sum: parseFloat(sumN)
            });
            toggleModal();
        } catch (error) {
            console.error('Error updating data:', error);
        }
    };

    const deleteItem = async () => {
        try {
            await deleteData(id, 'spendings');
            toggleModal();
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

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
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.modalTitle}>{title}</Text>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                onChangeText={setNumber}
                                value={number}
                                placeholder="How much have you spent ?"
                                placeholderTextColor="gray"
                                keyboardType="numeric"
                                autoCorrect={false}
                                autoCapitalize="none"
                            />
                            <Picker
                                selectedValue={currency}
                                style={styles.picker}
                                onValueChange={(itemValue) => setCurrency(itemValue)}
                            >
                                <Picker.Item label="$" value="$" style={styles.pickerItem} />
                                <Picker.Item label="£" value="£" />
                                <Picker.Item label="€" value="€" />
                            </Picker>
                        </View>
                        <TextInput
                            style={styles.inputDescription}
                            onChangeText={setDescription}
                            value={description}
                            placeholder="Description"
                            placeholderTextColor="gray"
                        />
                        <DateTimePicker
                            style={styles.pickerDate}
                            value={chosenDate}
                            mode="date"
                            onChange={handleDateChange}
                        />
                        <View style={styles.container}>
                            {isUpdate ? (
                                <>
                                    <Pressable
                                        style={[styles.button, styles.buttonSubmit]}
                                        onPress={updateItem}>
                                        <Text style={styles.textStyle}>Update</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={deleteItem}>
                                        <Text style={styles.textStyle}>Delete</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    <Pressable
                                        style={[styles.button, styles.buttonSubmit]}
                                        onPress={saveData}>
                                        <Text style={styles.textStyle}>Submit</Text>
                                    </Pressable>
                                    <Pressable
                                        style={[styles.button, styles.buttonClose]}
                                        onPress={toggleModal}>
                                        <Text style={styles.textStyle}>Cancel</Text>
                                    </Pressable>
                                </>
                            )}
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
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    closeButtonText: {
        fontSize: 18,
        color: 'black',
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
    buttonSubmit: {
        backgroundColor: '#2196F3',
        marginRight: 10,
    },
    buttonClose: {
        backgroundColor: '#FF5733',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        height: 40,
        width:200,
        marginVertical: 10,
        borderWidth: 1,
        padding: 10,
    },
    inputDescription: {
        height: 38,
        marginVertical: 10,
        borderWidth: 1,
        width:200,
        padding: 10,
        marginTop:10,
        marginRight:65
    }, 
    picker: {
        height: 40,
        marginLeft:0,
        width: 70, 
        justifyContent:'center',
    },
    pickerItem: {
        textAlign:'center',
        
    },
    container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    pickerDate: {
        alignSelf: 'flex-start',
        justifyContent:'flex-start',
        marginVertical: 10,
        width: 200,
    }
});

export default CustomModal;
