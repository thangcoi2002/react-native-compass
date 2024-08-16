import React from 'react';
import {View} from 'react-native';
import CircleCompass from './CircleCompass';

const CompassScreen = () => {
  return (
    <View>
      {/* <Compass degree={degree} /> */}
      <CircleCompass />
      {/* <Text style={styles.txtDegree}>
        {onCalculationDegree(degree) +
          '°' +
          direction(onCalculationDegree(degree))}
      </Text> */}
    </View>
  );
};

export default CompassScreen;
