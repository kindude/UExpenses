import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Button, FlatList  } from 'react-native';
import { getData, storeData } from '../utils/db';
import { useIsFocused } from '@react-navigation/native'; 


const HistoryTab = () => {
    const [spendings, setSpendings] = useState([]);
    const isFocused = useIsFocused(); 

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
    }, []); 

    useEffect(() => {
        if (isFocused) {
            loadSpendings(); 
        }
    }, [isFocused, loadSpendings]); 

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