import React, {useEffect, useMemo, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Animated,
  Image,
  Dimensions,
} from 'react-native';
import {magnetometer} from 'react-native-sensors';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};

const {width} = Dimensions.get('window');

const CompassScreen: React.FC = () => {
  const [direction, setDirection] = useState<number>(0);
  const prevSensorData = useRef<Coordinates>({x: 0, y: 0, z: 0});
  const threshold = 1;

  const mapTo360Degrees = (value: number): number => {
    const minSensorValue = 11;
    const maxSensorValue = 120;
    const minDegree = 0;
    const maxDegree = 360;

    return (
      ((value - minSensorValue) / (maxSensorValue - minSensorValue)) *
        (maxDegree - minDegree) +
      minDegree
    );
  };
  const prevData = prevSensorData.current;

  const shouldSubscribe = useMemo(() => {
    return data => {
      const {x, y, z} = data;
      const dx = Math.abs(x - prevData.x);
      const dy = Math.abs(y - prevData.y);
      const dz = Math.abs(z - prevData.z);
      return dx > threshold || dy > threshold || dz > threshold;
    };
  }, [prevData.x, prevData.y, prevData.z]);

  useEffect(() => {
    const initialSubscription = magnetometer.subscribe(data => {
      if (shouldSubscribe(data)) {
        const subscription = magnetometer.subscribe(data => {
          const {x, y, z} = data;

          const dx = Math.abs(x - prevData.x);
          const dy = Math.abs(y - prevData.y);
          const dz = Math.abs(z - prevData.z);

          if (dx > threshold || dy > threshold || dz > threshold) {
            const newDirection = mapTo360Degrees(x);
            setDirection(newDirection);
            prevSensorData.current = data;
          }
        });
        initialSubscription.unsubscribe(); // Unsubscribe from the initial subscription
      }
      prevSensorData.current = data;
    });

    return () => {
      initialSubscription.unsubscribe();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.txt}>Direction: {direction.toFixed(2)}°</Text>
      <Animated.View
        style={{
          transform: [{rotate: 360 - direction + 'deg'}],
        }}>
        <Image
          source={require('../../../assets/img/compass_bg.png')}
          style={{
            height: width - 80,
            justifyContent: 'center',
            alignItems: 'center',
            resizeMode: 'contain',
          }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txt: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default CompassScreen;
