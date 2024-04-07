import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Pressable, Image } from 'react-native';
import { Audio } from 'expo-av';
import PlusButton from '../components/plusButton';
import CustomModal from '../components/modal';
import { getData, storeData } from '../utils/db';
import { useIsFocused } from '@react-navigation/native';
import { fetchTheme } from '../utils/fetchTheme';
import FlipCard from 'react-native-flip-card'
import { idioms } from '../utils/idioms';
import RandomPhrase from '../utils/randomizer';
import { LinearGradient } from 'expo-linear-gradient';
import { getRate } from '../utils/db';
import requestRatesAndSaveToAsyncStorage from '../utils/api';


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
  const [idiom, setIdiom] = useState('');

  const [scheme, setScheme] = useState();
  const [USD, setUSD] = useState();
  const [EUR, setEUR] = useState();

  
  const [modalVisible, toggleModal] = useModalState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    fetchTheme().then(theme => {
      setScheme(theme);
    }).catch(error => {
      console.error('Error fetching theme:', error);
      setScheme('1');
    });

  }, []);

  useEffect(() => {
    const retrieveRates = async () => {

      await requestRatesAndSaveToAsyncStorage();
      const usd = await getRate('USD');
      const eur = await getRate('EUR');
      setUSD(usd);
      setEUR(eur);

      console.log(usd, eur);

    };
    retrieveRates();

  }, []);



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

  const updateDataAfterModalClose = async () => {
    loadSpendings();
  };

  useEffect(() => {
    const calculateTotal = async () => {
      try {
        const spendingsArrays = await getData('spendings');
        const today = new Date().toISOString().split('T')[0];
        let total = 0;
        if (spendingsArrays) {
          for (const spendingsArray of spendingsArrays) {
            for (const spending of spendingsArray) {
              if (spending.date.split('T')[0] === today) {
                total += parseFloat(spending.sum);
              }
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
  }, [toggleModal, isFocused]);



  useEffect(() => {
    return () => {
      console.log('Unloading Sound');
      sound && sound.unloadAsync();
    };
  }, [sound]);

  function checkLength() {
    return spent.toString().length;
  }

  useEffect(() => {
    const idiom = RandomPhrase(idioms);
    setIdiom(idiom);

  }, []);


  return (
    <View style={styles.container}>

      <View style={styles.topContainer}>
        <View style={[styles.sumContainer, { backgroundColor: scheme === '1' ? 'silver' : 'grey' }]}>
          <Text style={[styles.sumText, { fontSize: 50, color: scheme === '1' ? 'black' : 'white' }]}>£{spent}</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.spentText, { fontSize: checkLength() > 2 ? 30 : 50 }, { paddingTop: checkLength() > 2 ? 40 : 20 }]}>spent today</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <PlusButton onPress={playSound} style={styles.plusButton} />
      </View>
      <View style={styles.cardContainer}>
        <FlipCard>
          <LinearGradient
            colors={['#0077FF', '#00C6FF']}
            style={[styles.face, styles.card, styles.gradient]}
          >
            <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, styles.textCard]}>Bank Card</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={[styles.cardNumber, styles.textCard]}>1234 5678 9012 3456</Text>
            <Text style={[styles.cardExpiry, styles.textCard]}>Exp: 12/24</Text>
          </View>
          </LinearGradient>

          <LinearGradient
            colors={['#0077FF', '#00C6FF']}
            style={[styles.back, styles.gradient, styles.card]}
          >

            <Text style={[styles.text, { fontSize: 24 }]}>{idiom}</Text>
          </LinearGradient>
        </FlipCard>
    
      </View>
      <View style={styles.ratesContainer}>
        <Text style={[styles.ratesTitle]}>Today's Rates</Text>
        <View style={styles.rateItem}>
          <Text style={styles.rateCurrency}>USD:</Text>
          <Text style={styles.rateValue}>{USD}</Text>
        </View>
        <View style={styles.rateItem}>
          <Text style={styles.rateCurrency}>EUR:</Text>
          <Text style={styles.rateValue}>{EUR}</Text>
        </View>
      </View>
      <CustomModal modalVisible={modalVisible} toggleModal={toggleModal} isUpdate={false} item={null} updateDataAfterModalClose={updateDataAfterModalClose} usd={USD} eur={EUR} />
    </View>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',

    marginTop: 10,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sumContainer: {
    padding: 10,
    borderTopRightRadius: 10,
  },
  sumText: {
    color: 'white',
    fontWeight: 'bold',
  },
  textContainer: {
    marginLeft: 10,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  spentText: {
    fontSize: 40,
    color: 'gray',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  plusButton: {
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  cardContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  face: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  back: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    height: 200,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    padding: 20,
    borderWidth: 0, 
  },
  cardHeader: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardBody: {},
  cardNumber: {
    fontSize: 16,
    marginBottom: 5,
  },
  cardExpiry: {
    fontSize: 12,
  },
  text: {
    color: 'white', 
    fontSize: 18,
  },
  textCard: {
    color: '#f0f8ff'
  },

  ratesContainer: {
    marginTop: 200,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5', 
    padding: 10,
  },
  ratesTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', 
  },
  rateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10, 
  },
  rateCurrency: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0077FF',
  },
  rateValue: {
    fontSize: 18,
    color: '#0077FF', 
  },
});

export default HomeTab;