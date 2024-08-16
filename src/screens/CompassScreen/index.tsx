import React, {useEffect, useState, useRef, useCallback} from 'react';
import {Text, View} from 'react-native';
import {
  magnetometer,
  setUpdateIntervalForType,
  SensorTypes,
  // accelerometer,
} from 'react-native-sensors';
import {map} from 'rxjs/operators';
import Compass from './Compass';
import {styles} from './styles';

type Coordinates = {
  x: number;
  y: number;
  z: number;
};

const CompassScreen = () => {
  const [degree, setDegree] = useState<number>(0);
  const lastCoordinatesRef = useRef<Coordinates | undefined>({
    x: 0,
    y: 0,
    z: 0,
  });

  const onCalculationAngle = useCallback((newCoordinates: any) => {
    let answer = 0;
    if (newCoordinates) {
      const x = Number(newCoordinates.x.toFixed()) - 73;
      const y = Number(newCoordinates.y.toFixed()) + 81;
      answer = Math.atan2(y, x) * (180 / Math.PI);
      answer = (answer + 360) % 360;
    }
    return Math.round(answer);
  }, []);

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
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);
    setUpdateIntervalForType(SensorTypes.accelerometer, 100);

    const subscription = magnetometer
      .pipe(
        map(({x, y, z}) => ({
          x: Math.round(x),
          y: Math.round(y),
          z: Math.round(z),
        })),
      )
      .subscribe(newCoordinates => {
        if (
          lastCoordinatesRef.current &&
          (Math.abs(newCoordinates.x - lastCoordinatesRef.current.x) > 1 ||
            Math.abs(newCoordinates.y - lastCoordinatesRef.current.y) > 1)
        ) {
          setDegree(onCalculationAngle(newCoordinates));
        }
        lastCoordinatesRef.current = newCoordinates;
      });

    // const subscriptionAccel = accelerometer
    //   .pipe(map(({x, y, z}) => ({x, y, z})))
    //   .subscribe(speed => {});

    return () => {
      subscription.unsubscribe();
      // subscriptionAccel.unsubscribe();
    };
  }, [onCalculationAngle]);

  return (
    <View>
      <Compass degree={degree} />
      <Text style={styles.txtDegree}>
        {onCalculationDegree(degree) +
          '°' +
          direction(onCalculationDegree(degree))}
      </Text>
    </View>
  );
};

export default CompassScreen;
