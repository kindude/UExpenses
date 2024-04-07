import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated, useColorScheme } from 'react-native';
import { useNavigation, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import HomeTab from './Tabs/HomeTab';
import HistoryTab from './Tabs/HistoryTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import biometricsAuth from './utils/biometrics';
import CustomFadeIn from './ui/fadingScreen';
import SettingsTab from './Tabs/SettingsTab';
import { fetchTheme } from './utils/fetchTheme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

const ApplicationScreen = () => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [finished, setFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;



  useEffect(() => {
    authenticateWithBiometrics();
  }, []);


  
  const [scheme, setScheme] = useState();

  const authenticateWithBiometrics = async () => {
    try {
      const res = await biometricsAuth();
      if (res && res.success) {
        setIsAuthenticated(true);
        startAnimation();
      }
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  };

  const startAnimation = () => {
    fetchTheme().then(theme => {
      console.log(theme);
      setScheme(theme);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          setFinished(true);
          navigation.navigate('Home');
        }, 3000);
      });
    });
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isAuthenticated ? (
        <CustomFadeIn fadeAnim={fadeAnim}>
          <Text style={{ fontSize: 28, color: scheme === '1' ? 'white' : 'black' }}>UExpenses</Text>
          {finished && <Text>Finished</Text>}
        </CustomFadeIn>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};



const App = () => {
  const [scheme, setScheme] = useState();

  useEffect(() => {
    const fetchAndSetTheme = async () => {
      try {
        const theme = await fetchTheme();
        setScheme(theme);
      } catch (error) {
        console.error('Error fetching theme:', error);
        setScheme(DarkTheme);
      }
    };
    fetchAndSetTheme();
  }, []);


  return ( 
    <NavigationContainer theme={scheme === '1' ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarVisible: route.name !== 'Application',
        })}
      >
        <Tab.Screen
          name="Application"
          component={ApplicationScreen}
          options={{
            tabBarButton: () => null, headerShown: false,
            showLabel: false,
            showIcon: false,
            tabBarLabelStyle: { display: 'none' },
            tabBarIconStyle: { display: 'none' },
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="home" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="History"
          component={HistoryTab}
          options={{
            title: 'History',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsTab}
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="cog" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );



};

export default App;