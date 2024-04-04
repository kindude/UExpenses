import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'https://api.frankfurter.app';



const requestRatesAndSaveToAsyncStorage = async () => {
  try {
    const lastCallTimestamp = await AsyncStorage.getItem('lastCallTimestamp');
    const currentDate = new Date();
    const oneDayInMillis = 24 * 60 * 60 * 1000; 
    if (!lastCallTimestamp || currentDate - new Date(lastCallTimestamp) >= oneDayInMillis) {
      const url = API_URL + '/latest?from=GBP';
      const params = {
        to: 'USD, EUR',
        from: 'GBP'
      };

      const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      const { rates } = data;

      console.log('Rates:');
      Object.entries(rates).forEach(([currency, rate]) => {
        console.log(`${currency}: ${rate}`);
        saveRate(currency, rate);
      });

      await AsyncStorage.setItem('lastCallTimestamp', currentDate.toString());
    } else {
      console.log('API call skipped. Less than a day has passed since the last call.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const saveRate = async (currency, rate) => {
  try {
    await AsyncStorage.setItem(currency, rate.toString());
    console.log(`Saved rate for ${currency}: ${rate}`);
  } catch (error) {
    console.error(`Error saving rate for ${currency}:`, error);
  }
};

export default requestRatesAndSaveToAsyncStorage;
