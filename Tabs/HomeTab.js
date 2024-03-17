import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import PlusButton from '../components/plusButton';
import CustomModal from '../components/modal';
import { getData, storeData } from '../utils/db';

export const useModalState = (initialState = false) => {
  const [modalVisible, setModalVisible] = useState(initialState);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  return [modalVisible, toggleModal];
};




const HomeTab = () => {
  const [spent, setSpent] = useState('');
  const [sound, setSound] = useState();
  const [res, setRes] = useState(''); 
  const [total, setTotal] = useState(0);


  const [modalVisible, toggleModal] = useModalState(false);

  async function playSound() {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: 1,
        playsInSilentModeIOS: true,
        interruptionModeAndroid: 2,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playsThroughEarpieceAndroid: true
      });
  
      const { sound } = await Audio.Sound.createAsync(require('../assets/money.mp3'));
      setSound(sound);
  
      await sound.playAsync();
      toggleModal();
    } catch (error) {
      console.error('Failed to play sound:', error);
    }
  }
  
  useEffect(() => {
    const calculateTotal = async () => {
      try {
          const spendingsArrays = await getData('spendings');
          let total = 0;
          if (spendingsArrays) {
              for (const spendingsArray of spendingsArrays) {
                  for (const spending of spendingsArray) {
                      total += parseFloat(spending.sum);
                  }
              }
          }
          setSpent(total);
          console.log('Total sum:', total);
      } catch (error) {
          console.error('Error calculating total:', error);
      }
  };

     calculateTotal();
}, [toggleModal]);



  useEffect(() => {
    return () => {
      console.log('Unloading Sound');
      sound && sound.unloadAsync();
    };
  }, [sound]);

  

  return (
    <View style={styles.container}>
      

      <View style={styles.topContainer}>
        <View style={styles.sumContainer}>
          <Text style={[styles.sumText, { fontSize: 50 }]}>£{spent}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.spentText, { fontSize: spent > 999 ? 30 : 50 }, {paddingTop: spent > 999 ? 40 : 20}]}>spent today</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PlusButton onPress={playSound} style={styles.plusButton} />
      </View>
 
      <CustomModal modalVisible={modalVisible} toggleModal={toggleModal} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop:10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sumContainer: {
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderTopRightRadius: 10,
  },
  sumText: {
    color: 'white',
    fontWeight: 'bold',
    
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column', // Align children vertically
    alignItems: 'flex-end', // Align children to the end (bottom)

  },
  spentText: {
    
    fontSize: 40,
    color: 'gray',
    justifyContent: 'flex-end'
  },

  plusButton: {
    marginLeft:20,
  },
});

export default HomeTab;