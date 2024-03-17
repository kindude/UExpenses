// import React, { useState, useEffect, useRef } from 'react';
// import { View, Text, Animated } from 'react-native';
// import biometricsAuth from './utils/biometrics';
// import CustomFadeIn from './ui/fadingScreen';
// import { useNavigation } from '@react-navigation/native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import HomeTab from './Tabs/HomeTab';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import HistoryTab from './Tabs/HistoryTab';

// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();

// const Application = () => {
//     const navigation = useNavigation(); 
   
//     const [errorMessage, setErrorMessage] = useState('');
//     const [isAuthenticated, setAuthenticated] = useState(false);
//     const [finished, setFinished] = useState(false); 
//     const fadeAnim = useRef(new Animated.Value(0)).current;
  
//     useEffect(() => {
//       authenticateWithBiometrics();
//     }, []); 
  
//     const authenticateWithBiometrics = async () => {
//       try {
//         const res = await biometricsAuth();
//         if (res && res.success) {
//           setAuthenticated(true);
//           startAnimation(); 
//         }
//         console.log(res);
//       } catch (error) {
//         console.error(error);
//       }
//     };
  
//     const startAnimation = () => {
//       Animated.timing(fadeAnim, {
//         toValue: 1,
//         duration: 1000,
//         useNativeDriver: true,
//       }).start(() => {
//         setTimeout(() => {
//           setFinished(true);
//           navigation.navigate('Home');
//         }, 3000);
//       });
//     };
  
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         {isAuthenticated ? (
//           <CustomFadeIn fadeAnim={fadeAnim}>
//             <Text style={{ fontSize: 28 }}>UExpenses</Text>
//             {finished && <Text>Finished</Text>}
//           </CustomFadeIn>
//         ) : (
//           <Text>Loading...</Text>
//         )}
//       </View>
//     );
//   };

// const App = () => {
  
//   return (

  
//     <NavigationContainer>
        
//       <Tab.Navigator>
//       <Tab.Screen
//           name="Application"
//           component={Application}
//           options={{tabBarStyle: { display: 'none' }, headerShown:false, showLabel: false, showIcon:false, tabBarLabelStyle: {display: 'none' }, tabBarIconStyle: {display:'none'}}}
//         />
        
//       <Tab.Screen
//           name="Home"
//           component={HomeTab}
//           options={{
//             title: "Home", 
//             headerTitle: "UExpenses",
//             tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
//           }}
//         />
//         <Tab.Screen
//           name="History"
//           component={HistoryTab}
//           options={{
//             title: "History", 
//             headerTitle: "UExpenses",
//             tabBarIcon: ({ color }) => <FontAwesome size={28} name="book" color={color} />,
//           }}
//         />
        

//       </Tab.Navigator>  
//     </NavigationContainer>
//   );
// }

// export default App;



import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeTab from './Tabs/HomeTab';
import HistoryTab from './Tabs/HistoryTab';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import biometricsAuth from './utils/biometrics';
import CustomFadeIn from './ui/fadingScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const ApplicationScreen = () => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [finished, setFinished] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    authenticateWithBiometrics();
  }, []);

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
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {isAuthenticated ? (
        <CustomFadeIn fadeAnim={fadeAnim}>
          <Text style={{ fontSize: 28 }}>UExpenses</Text>
          {finished && <Text>Finished</Text>}
        </CustomFadeIn>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen
          name="Application"
          component={ApplicationScreen}
          options={{
            tabBarStyle: { display: 'none' },
            headerShown: false,
            showLabel: false,
            showIcon: false,
            tabBarLabelStyle: { display: 'none' },
            tabBarIconStyle: { display: 'none' },
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeTab}
          options={{
            title: 'Home',
            headerTitle: 'UExpenses',
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
            headerTitle: 'UExpenses',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={HistoryTab}
          options={{
            title: 'Settings',
            headerTitle: 'UExpenses',
            tabBarIcon: ({ color }) => (
              <FontAwesome size={28} name="book" color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
