import React, {useEffect, useRef} from 'react';
import {Animated, Dimensions, Image, Text, View} from 'react-native';
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

const {width} = Dimensions.get('screen');

const CircleCompass: React.FC = () => {
  const numbers = Array.from({length: 12}, (_, i) => i * 30);
  const labels = ['B', 'Đ', 'N', 'T'];
  const radius = (width - 40) / 2;
  const circleRadius = 25;
  const animatedCircle = useRef(new Animated.Value(0));
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
      Animated.spring(animatedCircle.current, {
        toValue: animatedAngle.current,
        friction: 4,
        tension: 15,
        useNativeDriver: true,
      }).start();

      lastDegree.current = currentDegree.current;
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <Animated.View
        style={[
          {
            transform: [
              {
                rotate: animatedCircle.current.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '-360deg'],
                }),
              },
            ],
          },
        ]}>
        <Image
          style={styles.image}
          source={require('../../../assets/img/compass_bg.png')}
        />
        {numbers.map((number, index) => {
          const angle = (index / numbers.length) * 2 * Math.PI;
          const x = radius * Math.cos(angle) - circleRadius;
          const y = radius * Math.sin(angle) - circleRadius;

          return (
            <Animated.View
              key={number}
              style={[
                styles.numberCircle,
                {
                  left: radius + x - 20,
                  top: radius + y - 20,
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  borderRadius: circleRadius,
                  transform: [
                    {
                      rotate: animatedCircle.current.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={styles.txtNumber}>{number}</Text>
            </Animated.View>
          );
        })}
        {labels.map((label, index) => {
          const angle = (index / labels.length) * 2 * Math.PI;
          const x = (radius - 80) * Math.cos(angle) - circleRadius;
          const y = (radius - 80) * Math.sin(angle) - circleRadius;

          return (
            <Animated.View
              key={label}
              style={[
                styles.labelCircle,
                {
                  left: radius + x - circleRadius + 5,
                  top: radius + y - circleRadius + 5,
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  borderRadius: circleRadius,
                  transform: [
                    {
                      rotate: animatedCircle.current.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={styles.txtLabel}>{label}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default CircleCompass;
