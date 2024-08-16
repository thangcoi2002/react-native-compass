import React, {useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Image,
  LayoutAnimation,
  Text,
  View,
} from 'react-native';
import {styles} from './styles';

const {width} = Dimensions.get('window');

interface CompassProps {
  degree: number;
  // balance: {
  //   x: number;
  //   y: number;
  //   z: number;
  // };
}

const Compass: React.FC<CompassProps> = ({degree}) => {
  const numbers = Array.from({length: 12}, (_, i) => i * 30);
  const labels = ['B', 'Đ', 'N', 'T'];
  const radius = (width - 40) / 2;
  const circleRadius = 25;

  const animatedCircle = useRef(new Animated.Value(0)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  const animatedLabel = useRef(new Animated.Value(0)).current;

  const prevCircle = useRef(0);
  const prevCircleLabel = useRef(0);

  // const onHandleAnimatedBalance = useCallback(() => {
  //   Animated.parallel([
  //     Animated.timing(animatedTranslateX, {
  //       toValue: balance.x * 10,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //     Animated.timing(animatedTranslateY, {
  //       toValue: -balance.y * 10,
  //       duration: 100,
  //       useNativeDriver: true,
  //     }),
  //   ]).start();
  // }, [balance, animatedTranslateX, animatedTranslateY]);

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

  // useEffect(() => {
  //   onHandleAnimatedBalance();
  // }, [balance, onHandleAnimatedBalance]);

  return (
    <View>
      <View style={[styles.accelerometer]}>
        <Animated.View
          style={{
            transform: [
              {translateX: animatedTranslateX},
              {translateY: animatedTranslateY},
            ],
          }}>
          <Image
            source={require('../../../assets/img/balance.png')}
            style={[styles.accelerometerCircle, {}]}
          />
        </Animated.View>
        <Image
          source={require('../../../assets/img/plusIcon.png')}
          style={[styles.plusIcon]}
        />
      </View>
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [
              {
                rotate: animatedCircle.interpolate({
                  inputRange: [0, 360],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}>
        <Image
          source={require('../../../assets/img/compass_bg.png')}
          style={styles.image}
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
                      rotate: animatedLabel.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={[styles.number]}>{number}</Text>
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
                      rotate: animatedLabel.interpolate({
                        inputRange: [0, 360],
                        outputRange: ['0deg', '360deg'],
                      }),
                    },
                  ],
                },
              ]}>
              <Text style={[styles.label]}>{label}</Text>
            </Animated.View>
          );
        })}
      </Animated.View>
    </View>
  );
};

export default Compass;
