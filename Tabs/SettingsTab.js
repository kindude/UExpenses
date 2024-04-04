import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Text, TextInput, Pressable, Keyboard } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';
import { getDBGoal, getTheme, setDBGoal, setTheme } from '../utils/db';
import { useIsFocused } from '@react-navigation/native';
import ProgressBar from '../ui/progressBar';
import filterByMonthGeneral from '../utils/filterByMonth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getData } from '../utils/db';

const SettingsTab = () => {
    const [selectedId, setSelectedId] = useState(null);
    const [scheme, setScheme] = useState();
    const isFocused = useIsFocused();
    const [goal, setGoal] = useState(0);
    const [goalInput, setGoalInput] = useState('');
    const [total, setTotal] = useState(0);
    const [percent, setPercent] = useState(0);

    const onGoalInputChange = (text) => {
        setGoalInput(text);
    };


    const reloadSpendingsAndGoal = async () => {
        try {
            // Load goal first
            const retrGoal = await getDBGoal('goal');
            console.log(retrGoal);
            const g = parseFloat(retrGoal);
            setGoal(g);
            setGoalInput(retrGoal);

            // Then load spendings
            const data = await getData('spendings');
            console.log('Retrieved spendings:', data);

            if (data && data.length > 0) {
                const flattenedData = data.flat();
                const { totalSum, filteredSpendings } = filterByMonthGeneral(flattenedData);
                console.log(totalSum);
                setTotal(totalSum);
            }
        } catch (error) {
            console.error('Error loading spendings and goal:', error);
        }
    };

    useEffect(() => {
        reloadSpendingsAndGoal();
    }, [isFocused]);

    useEffect(() => {
        const calculatePercent = () => {
            const totalAmount = parseFloat(total);
            const goalAmount = parseFloat(goal);

            if (!isNaN(totalAmount) && !isNaN(goalAmount)) {
                const percent = totalAmount / goalAmount;
                console.log(percent);
                setPercent(percent);
            } else {
                console.error('Invalid total or goal value');
                setPercent(0);
            }
        };

        calculatePercent();
    }, [total, goal]);

    const saveGoal = async () => {
        try {
            await AsyncStorage.removeItem('goal');
            await setDBGoal('goal', goalInput);
            Keyboard.dismiss();
            reloadSpendingsAndGoal(); 
        } catch (error) {
            console.error('Error saving goal:', error);
        }
    };

    const radioButtons = useMemo(() => ([
        {
            id: '0',
            label: 'Light',
            value: 'LIGHT'
        },
        {
            id: '1',
            label: 'Dark',
            value: 'DARK'
        }
    ]), []);

    useEffect(() => {
        const fetchTheme = async () => {
            try {
                const theme = await getTheme('theme');
                if (theme !== null) {
                    setSelectedId(theme);
                    setScheme(theme);
                } else {
                    setSelectedId('1');
                }
            } catch (error) {
                console.error('Error fetching theme:', error);
            }
        };

        fetchTheme();
    }, [isFocused]);

    useEffect(() => {
        const updateTheme = async () => {
            try {
                if (selectedId) {
                    await setTheme('theme', selectedId);
                }
            } catch (error) {
                console.error('Error updating theme:', error);
            }
        };

        updateTheme();
    }, [selectedId]);

    return (
        <View style={styles.container}>
            <Text style={[styles.label, { color: scheme === '1' ? 'white' : 'black' }]}>Select Theme</Text>
            <View style={[styles.radioGroup, { color: scheme === '1' ? 'white' : 'black' }]}>
                <RadioGroup
                    radioButtons={radioButtons}
                    onPress={setSelectedId}
                    selectedId={selectedId}
                    labelStyle={{ color: scheme === '1' ? 'white' : 'black' }}
                />
            </View>
            <View style={styles.progressBar}>
                <Text style={[styles.goalText, { color: scheme === '1' ? 'white' : 'black' }]}>Your Progress</Text>
                <ProgressBar progress={percent} duration={1000} />
            </View>
            <Text style={[styles.goalText, { color: scheme === '1' ? 'white' : 'black' }]}>Set your monthly goal</Text>
            <TextInput
                style={[styles.input, { color: scheme === '1' ? 'white' : 'black' }]}
                onChangeText={onGoalInputChange}
                value={goalInput}
                keyboardType="numeric"
                placeholder="Set your goal..."
                placeholderTextColor="gray"
            />
            <Pressable onPress={saveGoal} style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    label: {
        marginBottom: 10,
        fontSize: 30,
        fontWeight: 'bold',
    },
    radioGroup: {
        fontSize: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    applyButton: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    applyButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 10,
        marginBottom: 10,
    },

    goalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    progressBar: {
        marginTop: 40,
        marginBottom: 40,
    }
});

export default SettingsTab;
