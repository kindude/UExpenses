import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { getData, storeData } from '../utils/db';
import { useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';

const HistoryTab = () => {
    const [spendings, setSpendings] = useState([]);
    const [filterOption, setFilterOption] = useState('');
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
            <Text>{item.date ? item.date : ''}</Text>
            <Text>£{item.sum}</Text>
        </View>
    );

    const handleFilterChange = (itemValue) => {
        setFilterOption(itemValue);
    };

    const filterByDay = () => {
        // Filter spendings for the current day
        const today = new Date().toLocaleDateString();
        const filteredSpendings = spendings.filter(item => item.date === today);
        setSpendings(filteredSpendings);
    };

    const filterByWeek = () => {
        // Filter spendings for the current week
        const today = new Date();
        const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
        const lastDayOfWeek = new Date(firstDayOfWeek.setDate(firstDayOfWeek.getDate() + 6));
        const filteredSpendings = spendings.filter(item => {
            const spendingDate = new Date(item.date);
            return spendingDate >= firstDayOfWeek && spendingDate <= lastDayOfWeek;
        });
        setSpendings(filteredSpendings);
    };

    const filterByMonth = () => {
        // Filter spendings for the current month
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const filteredSpendings = spendings.filter(item => {
            const spendingDate = new Date(item.date);
            return spendingDate >= firstDayOfMonth && spendingDate <= lastDayOfMonth;
        });
        setSpendings(filteredSpendings);
    };

    useEffect(() => {
        loadSpendings();
        switch (filterOption) {
            case 'Day':
                filterByDay();
                break;
            case 'Week':
                filterByWeek();
                break;
            case 'Month':
                filterByMonth();
                break;
            default:
                loadSpendings();
        }
    }, [filterOption, loadSpendings]);

    return (
        <View style={styles.container}>
            <DropDownPicker
                items={[
                    { label: 'Day', value: 'Day' },
                    { label: 'Week', value: 'Week' },
                    { label: 'Month', value: 'Month' },
                ]}
                defaultValue={filterOption}
                containerStyle={{ height: 40, marginBottom: 10 }}
                style={{ backgroundColor: '#fafafa' }}
                itemStyle={{
                    justifyContent: 'flex-start'
                }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
                onChangeItem={(item) => handleFilterChange(item.value)}
            />
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