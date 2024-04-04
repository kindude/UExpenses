import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, newValue) => {
    try {
        const existingData = await AsyncStorage.getItem(key);
        let newData = [];
        
        if (existingData) {
            newData = JSON.parse(existingData);
            
            newData.push(newValue);
        } else {
            newData = [newValue];
        }

        await AsyncStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
        console.error('Error storing data:', error);
    }
};

export const updateData = async (key, idToUpdate, newData) => {
  try {
      const existingData = await AsyncStorage.getItem(key);

      if (existingData) {
          let dataArray = JSON.parse(existingData);
          const updatedData = dataArray.map((spendingsArray) => {
              if (Array.isArray(spendingsArray)) {
                  return spendingsArray.map((spending) => {
                      if (spending.id === idToUpdate) {
                          return newData;
                      }
                      return spending;
                  });
              }
              return spendingsArray;
          });

          await AsyncStorage.setItem(key, JSON.stringify(updatedData));
      }
  } catch (error) {
      console.error('Error updating data:', error);
  }
};

export const getData = async (key) => {
  try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
      console.error('Error getting data:', e);
  }
};

export const deleteData = async (id, key) => {
  try {
      let data = await getData(key);

      if (!Array.isArray(data)) {
          throw new Error('Retrieved data is not an array');
      }

      const updatedData = data.map((spendingsArray) => {
          if (!Array.isArray(spendingsArray)) {
              throw new Error('Spendings array is not an array');
          }
          return spendingsArray.filter((spending) => spending.id !== id);
      });

      const filteredData = updatedData.filter((spendingsArray) => spendingsArray.length > 0);

      await AsyncStorage.setItem(key, JSON.stringify(filteredData));
  } catch (error) {
      console.error('Error deleting data:', error);
  }
};



export const setTheme = async (key, value) => {
  try {
      await AsyncStorage.setItem(key, value);
  } catch (error) {
      console.error('Error setting the theme:', error);
  }
};

export const getTheme = async (key) => {
  try {
      const themeJSON = await AsyncStorage.getItem(key);
      return themeJSON ? themeJSON : null;
  } catch (error) {
      console.error('Error getting the theme:', error);
  }
};



export const setDBGoal = async (key, value) => {
    try{
        await AsyncStorage.setItem(key, value);
        console.log(value);

    }catch(error){
        console.log('Error setting goal', error);
    }

};

export const getDBGoal = async(key) => {

  try {
      const goalJSON = await AsyncStorage.getItem(key);
      console.log(goalJSON);
      return goalJSON;
  } catch (error) {
      console.error('Error getting the theme:', error);
  }
}

export const getRate = async (key) => {
    
    try {
        const rate = await AsyncStorage.getItem(key);
        return rate;
    } catch (error) {
        console.error('Error getting the rate:', error);
    }

};