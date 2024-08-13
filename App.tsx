import React from 'react';
import CompassScreen from './src/screens/CompassScreen';
import {StyleSheet, View} from 'react-native';

const App: React.FC = () => {
  return (
    <View style={styles.container}>
      <CompassScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
