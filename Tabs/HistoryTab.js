import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, FlatList  } from 'react-native';
import { getData, storeData } from '../utils/db';
import { useIsFocused } from '@react-navigation/native'; // Import the hook


const HistoryTab = () => {
    const [spendings, setSpendings] = useState([]);
    const isFocused = useIsFocused(); // Get the isFocused value from the hook

    const loadSpendings = useCallback(async () => {
        try {
            const data = await getData('spendings');
            console.log('Retrieved spendings:', data);
            if (data) {
                const flattenedData = data.flat();
                setSpendings(flattenedData);
            }
        } catch (error) {
            console.error('Error loading spendings:', error);
        }
    }, []); // Include the dependencies array

    useEffect(() => {
        if (isFocused) {
            loadSpendings(); // Load spendings when the tab is focused
        }
    }, [isFocused, loadSpendings]); // Include isFocused and loadSpendings in the dependencies array

    const renderSpendingItem = ({ item }) => (
        <View style={styles.item}>
            <Text>{item.description}</Text>
            <Text>£{item.sum}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={spendings}
                renderItem={renderSpendingItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
  },
  item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
  },
});

export default HistoryTab;