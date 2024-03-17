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

export const getData = async (key) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        
    }
};
