import React, { useRef, useEffect } from 'react';
import { Animated} from 'react-native';

const FadeInView = ({ children, style }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;






  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;

