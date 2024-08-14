import React, {useEffect, useRef, useState} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {
  magnetometer,
  accelerometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import Compass from './Compass';
import {debounce} from 'lodash';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};

const CompassScreen: React.FC = () => {
  const [degree, setDegree] = useState<number>(0);
  const [balance, setBalance] = useState<Coordinates>({x: 0, y: 0, z: 0});

  const prevSensorData = useRef<Coordinates>({x: 0, y: 0, z: 0});
  const prevBalanceData = useRef<Coordinates>({x: 0, y: 0, z: 0});

  const angle = (coordinates: Coordinates) => {
    let answer = 0;
    if (coordinates) {
      const x = Number(coordinates.x.toFixed()) - 73;
      const y = Number(coordinates.y.toFixed()) + 81;
      answer = Math.atan2(y, x) * (180 / Math.PI);
      answer = (answer + 360) % 360;
    }
    return Math.round(answer);
  };

  const direction = (valueDegree: number) => {
    if (valueDegree >= 22.5 && valueDegree < 67.5) {
      return 'ĐB';
    } else if (valueDegree >= 67.5 && valueDegree < 112.5) {
      return 'Đ';
    } else if (valueDegree >= 112.5 && valueDegree < 157.5) {
      return 'NĐ';
    } else if (valueDegree >= 157.5 && valueDegree < 202.5) {
      return 'N';
    } else if (valueDegree >= 202.5 && valueDegree < 247.5) {
      return 'TN';
    } else if (valueDegree >= 247.5 && valueDegree < 292.5) {
      return 'T';
    } else if (valueDegree >= 292.5 && valueDegree < 337.5) {
      return 'TB';
    } else {
      return 'B';
    }
  };

  const onCalculationDegree = (valueDegree: number) => {
    return valueDegree - 90 >= 0 ? valueDegree - 90 : valueDegree + 271;
  };

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 1000);
    setUpdateIntervalForType(SensorTypes.accelerometer, 1000);
    const magnetometerSubscription = magnetometer.subscribe(sensor => {
      debounce(() => {
        setDegree(angle(sensor));
        prevSensorData.current = sensor;
      }, 1000)();
    });

    const accelerometerSubscription = accelerometer.subscribe(accel => {
      debounce(() => {
        setBalance(accel);
        prevBalanceData.current = accel;
      }, 1000)();
    });

    return () => {
      magnetometerSubscription.unsubscribe();
      accelerometerSubscription.unsubscribe();
    };
  }, []);
  console.log(123);
  return (
    <View style={styles.container}>
      <Compass degree={degree} balance={balance} />
      <Text style={styles.txt}>{`${onCalculationDegree(degree)}° ${direction(
        onCalculationDegree(degree),
      )}`}</Text>
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
    marginTop: 100,
  },
});

export default CompassScreen;
