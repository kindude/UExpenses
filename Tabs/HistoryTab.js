import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { getData } from '../utils/db';
import { useIsFocused } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomModal from '../components/modal';
import { useModalState } from './HomeTab';
import { fetchTheme } from '../utils/fetchTheme';
import filterByMonthGeneral from '../utils/filterByMonth';
import requestRatesAndSaveToAsyncStorage from '../utils/api';
import { getRate } from '../utils/db';



const HistoryTab = () => {
    const [spendings, setSpendings] = useState([]);
    const [filterOption, setFilterOption] = useState('Day');
    const [filteredSpendings, setFilteredSpendings] = useState([]);
    const [item, setItem] = useState();
    const [total, setTotal] = useState();
    const isFocused = useIsFocused();
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState('Day');
    const [items, setItems] = useState([
        { label: 'Day', value: 'Day' },
        { label: 'Week', value: 'Week' },
        { label: 'Month', value: 'Month' }
    ]);
    const [modalVisible, toggleModal] = useModalState(false);

    const [scheme, setScheme] = useState();
    const [USD, setUSD] = useState();
    const [EUR, setEUR] = useState();


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


    useEffect(() => {
        fetchTheme().then(theme => {
            setScheme(theme);

            filterByMonth();
        }).catch(error => {
            console.error('Error fetching theme:', error);
            setScheme('1');
        });
    }, []);


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
    }, [isFocused, loadSpendings, modalVisible]);


    useEffect(() => {
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
                setFilteredSpendings(spendings);
        }
    }, [filterOption, spendings]);

    const filterByDay = () => {
        const today = new Date();
        const formattedToday = today.toISOString().split('T')[0];

        const filteredSpendings = spendings.filter(item => {
            const itemDate = item.date.split('T')[0];
            return itemDate === formattedToday;
        });

        let totalSum = 0;

        filteredSpendings.forEach(item => {
            totalSum += parseFloat(item.sum);
        });

        setTotal(totalSum);

        setFilteredSpendings(filteredSpendings);

    };

    const filterByWeek = () => {
        const today = new Date();
        const firstDayOfWeek = new Date(today);
        firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);
        const lastDayOfWeek = new Date(today);
        lastDayOfWeek.setDate(today.getDate() - today.getDay() + 7);
        const filteredSpendings = spendings.filter(item => {
            const itemDate = new Date(item.date);
            return itemDate >= firstDayOfWeek && itemDate <= lastDayOfWeek;
        });
        let totalSum = 0;

        filteredSpendings.forEach(item => {
            totalSum += parseFloat(item.sum);
        });

        setTotal(totalSum);

        setFilteredSpendings(filteredSpendings);
    };


    const filterByMonth = () => {

        const { totalSum, filteredSpendings } = filterByMonthGeneral(spendings);
        setTotal(totalSum);

        setFilteredSpendings(filteredSpendings);
    }





    const renderSpendingItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleItemClick(item)}>
            <View style={styles.item}>
                <Text style={[styles.description, {color: scheme === '1' ? 'white' : 'black'}]}>{item.description}</Text>
                <Text style={styles.date}>{item.date ? new Date(item.date).toLocaleDateString() : ''}</Text>
                <Text style={[styles.sum, {color: scheme === '1' ? 'white' : 'black'} ]}>£{item.sum}</Text>
            </View>
        </TouchableOpacity>
    );

    const handleItemClick = (item) => {
        setItem(item);
        toggleModal();
    };

    const handleFilterChange = (itemValue) => {
        setFilterOption(itemValue);
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.total, {color: scheme === '1' ? 'white' : 'black'}]}>Total spent £ {total}</Text>
            <DropDownPicker
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                onChangeValue={handleFilterChange}
                containerStyle={styles.dropdown}
            />
            <FlatList
                data={filteredSpendings}
                renderItem={renderSpendingItem}
                keyExtractor={(item, index) => index.toString()}
                style={styles.flatList}
            />
            <CustomModal toggleModal={toggleModal} modalVisible={modalVisible} isUpdate={true} item={item} usd={USD} eur={EUR}></CustomModal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    total: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    dropdown: {
        marginBottom: 10,
    },
    flatList: {
        marginTop: 10,
    },
    item: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    description: {
        flex: 1,
        fontSize: 16,
    },
    date: {
        fontSize: 14,
        color: '#666',
        marginRight: 10,
    },
    sum: {
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HistoryTab;