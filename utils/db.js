import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeData = async (key, newValue) => {
    try {
        // Get existing data
        const existingData = await AsyncStorage.getItem(key);
        let newData = [];
        
        if (existingData) {
            // Parse existing data
            newData = JSON.parse(existingData);
            
            // Add new value to the existing data
            newData.push(newValue);
        } else {
            // If no existing data, just use the new value as the data
            newData = [newValue];
        }

        // Store updated data
        await AsyncStorage.setItem(key, JSON.stringify(newData));
    } catch (error) {
        // Handle errors here
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
