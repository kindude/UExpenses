import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const ProgressBar = ({ progress, duration }) => {
    const barWidth = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      Animated.timing(barWidth, {
        toValue: progress * 100,
        duration: duration,
        useNativeDriver: false,
      }).start();
  
      return () => {
        barWidth.setValue(0);
      };
    }, [progress, duration, barWidth]);
  
    let progressBarColor;
  
    if (progress < 0.5) {
      progressBarColor = 'blue';
    } else if (progress < 0.6) {
      progressBarColor = 'green';
    } else {
      progressBarColor = 'red';
    }
  
    return (
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: barWidth.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }),
              backgroundColor: progressBarColor,
            },
          ]}
        />
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      height: 20,
      backgroundColor: '#f0f0f0',
      borderRadius: 10,
      overflow: 'hidden',
    },
    progressBar: {
      height: '100%',
      borderRadius: 10,
    },
  });
  
  export default ProgressBar;
  
