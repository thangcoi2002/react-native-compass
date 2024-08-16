import React, {useEffect, useRef} from 'react';
import {Animated, View} from 'react-native';
import {styles} from './styles';
import {magnetometer} from 'react-native-sensors';
import {map} from 'rxjs';

const onCalculationAngle = (newCoordinates: {x: number; y: number}) => {
  let angle = 0;
  if (newCoordinates) {
    const x = newCoordinates.x - 73;
    const y = newCoordinates.y + 81;
    angle = Math.atan2(y, x) * (180 / Math.PI);
    angle = (angle + 360) % 360;
  }
  return Math.round(angle);
};

const CircleCompass: React.FC = () => {
  const animatedCircle = useRef(new Animated.Value(0)).current;
  const animatedAngle = useRef(0);

  const currentDegree = useRef({x: 0, y: 0});
  const lastDegree = useRef({x: 0, y: 0});

  useEffect(() => {
    const subscription = magnetometer
      .pipe(
        map(({x, y}) => ({
          x: x,
          y: y,
        })),
      )
      .subscribe(newCoordinates => {
        currentDegree.current = newCoordinates;
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const angleCurrent = onCalculationAngle(currentDegree.current);
      const angleLast = onCalculationAngle(lastDegree.current);

      let diff = angleCurrent - angleLast;

      if (diff < -180) {
        diff = diff + 360;
      } else if (diff > 180) {
        diff = diff - 360;
      }

      animatedAngle.current += diff;
      Animated.spring(animatedCircle, {
        toValue: animatedAngle.current,
        friction: 0,
        tension: 30,
        useNativeDriver: true,
      }).start();

      lastDegree.current = currentDegree.current;
    }, 110);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Animated.Image
        style={[
          styles.image,
          {
            transform: [
              {
                rotate: animatedCircle.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}
        source={require('../../../assets/img/compass_bg.png')}
      />
    </View>
  );
};

export default CircleCompass;
