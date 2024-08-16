import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  LayoutAnimation,
  Text,
  View,
} from 'react-native';
import {styles} from './styles';
import {
  magnetometer,
  SensorTypes,
  setUpdateIntervalForType,
} from 'react-native-sensors';
import {Coordinates} from '../../types/Coordinates';
import {map} from 'rxjs';

const {width} = Dimensions.get('window');

const CircleCompass: React.FC = () => {
  const numbers = useMemo(() => Array.from({length: 12}, (_, i) => i * 30), []);
  const labels = useMemo(() => ['B', 'Đ', 'N', 'T'], []);
  const radius = useMemo(() => (width - 40) / 2, [width]);
  const circleRadius = useMemo(() => 25, []);
  const [degree, setDegree] = useState<number>(0);
  const lastCoordinatesRef = useRef<Coordinates | undefined>({
    x: 0,
    y: 0,
    z: 0,
  });

  const animatedCircle = useRef(new Animated.Value(0)).current;
  const animatedLabel = useRef(new Animated.Value(0)).current;

  const prevCircle = useRef(0);
  const prevCircleLabel = useRef(0);

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

  const direction = useCallback((valueDegree: number) => {
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
  }, []);

  const onCalculationDegree = useCallback((valueDegree: number) => {
    return valueDegree - 90 >= 0 ? valueDegree - 90 : valueDegree + 271;
  }, []);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.magnetometer, 100);
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

    return () => {
      subscription.unsubscribe();
    };
  }, [onCalculationAngle]);

  useEffect(() => {
    const currentDegree = prevCircle.current;
    let newDegree = 360 - degree;
    let diff = newDegree - currentDegree;

    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        newDegree = currentDegree - (360 - diff);
      } else {
        newDegree = currentDegree + (360 + diff);
      }
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.spring(animatedCircle, {
      toValue: newDegree,
      friction: 5,
      tension: 10,
      useNativeDriver: true,
    }).start();
    prevCircle.current = newDegree;
  }, [animatedCircle, degree]);

  useEffect(() => {
    const currentLabelCircle = prevCircleLabel.current;
    let newLabelCircle = degree;
    let diff = newLabelCircle - currentLabelCircle;
    if (Math.abs(diff) > 180) {
      if (diff > 0) {
        newLabelCircle = currentLabelCircle - (360 - diff);
      } else {
        newLabelCircle = currentLabelCircle + (360 + diff);
      }
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    Animated.spring(animatedLabel, {
      toValue: newLabelCircle,
      friction: 4,
      tension: 7,
      useNativeDriver: true,
    }).start();
  }, [degree, animatedLabel]);

  const renderNumberedCircle = useCallback(
    ({item, index}: {item: number; index: number}) => {
      const angle = (index / numbers.length) * 2 * Math.PI;
      const x = radius * Math.cos(angle) - circleRadius;
      const y = radius * Math.sin(angle) - circleRadius;

      return (
        <Animated.View
          key={index}
          style={{
            left: radius + x - 20,
            top: radius + y - 20,
            width: circleRadius * 2,
            height: circleRadius * 2,
            borderRadius: circleRadius,
            transform: [
              {
                rotate: animatedLabel.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          }}>
          <Text>{item}</Text>
        </Animated.View>
      );
    },
    [radius, circleRadius, numbers, animatedLabel],
  );

  const animatedStyle = useMemo(
    () => ({
      transform: [
        {
          rotate: animatedCircle.interpolate({
            inputRange: [0, 360],
            outputRange: ['0deg', '360deg'],
          }),
        },
      ],
    }),
    [animatedCircle],
  );

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Animated.View style={animatedStyle}>
        <Image
          source={require('../../../assets/img/compass_bg.png')}
          style={styles.image}
        />
        <FlatList
          data={numbers}
          keyExtractor={item => item.toString()}
          renderItem={renderNumberedCircle}
        />
      </Animated.View>
      <Text style={styles.txtDefault}>
        {onCalculationDegree(degree) +
          ' ° ' +
          direction(onCalculationDegree(degree))}
      </Text>
    </View>
  );
};

export default CircleCompass;
