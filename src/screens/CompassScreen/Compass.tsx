import React, {useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const {width} = Dimensions.get('window');

interface CompassProps {
  degree: number;
  balance: {
    x: number;
    y: number;
    z: number;
  };
}

const Compass: React.FC<CompassProps> = ({degree, balance}) => {
  const numbers = Array.from({length: 12}, (_, i) => i * 30);
  const labels = ['B', 'Đ', 'N', 'T'];
  const radius = (width - 40) / 2;
  const circleRadius = 25;

  const animatedValue = useRef(new Animated.Value(0)).current;
  const animatedTranslateX = useRef(new Animated.Value(0)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;
  const prevDegree = useRef(0);

  const onHandleAnimatedBalance = useCallback(() => {
    Animated.parallel([
      Animated.timing(animatedTranslateX, {
        toValue: balance.x * 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(animatedTranslateY, {
        toValue: -balance.y * 10,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [balance.x, balance.y, animatedTranslateX, animatedTranslateY]);

  useEffect(() => {
    const currentDegree = prevDegree.current;
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
    Animated.timing(animatedValue, {
      toValue: newDegree,
      duration: 300,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  }, [degree, animatedValue]);

  useEffect(() => {
    onHandleAnimatedBalance();
  }, [balance, onHandleAnimatedBalance]);

  return (
    <View>
      <Image
        source={require('../../../assets/img/plusIcon.png')}
        style={[styles.plusIcon]}
      />
      <Animated.View
        style={[
          styles.accelerometer,
          {
            transform: [
              {translateX: animatedTranslateX},
              {translateY: animatedTranslateY},
            ],
          },
        ]}>
        <Image
          source={require('../../../assets/img/balance.png')}
          style={styles.accelerometerCircle}
        />
      </Animated.View>
      <Animated.View
        style={[
          styles.circleContainer,
          {
            transform: [
              {
                rotate: animatedValue.interpolate({
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
                  transform: [{rotate: `${(degree * Math.PI) / 180}rad`}],
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
                  left: radius + x - circleRadius,
                  top: radius + y - circleRadius + 5,
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  borderRadius: circleRadius,
                  transform: [{rotate: `${(degree * Math.PI) / 180}rad`}],
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleContainer: {
    position: 'relative',
    width: width - 80,
    height: width - 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  accelerometer: {
    height: '100%',
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 5,
    left: -45,
  },
  plusIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    top: '37%',
    left: '28%',
    zIndex: 10,
  },
  accelerometerCircle: {
    width: 60,
    height: 60,
    backgroundColor: '#333',
    borderRadius: 30,
  },
  numberCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: 'white',
    fontSize: 20,
  },
  labelCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 40,
    fontWeight: '400',
    color: 'white',
  },
});

export default Compass;
