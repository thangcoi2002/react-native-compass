import {Dimensions, StyleSheet} from 'react-native';
const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
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
    position: 'absolute',
    top: '42%',
    left: '42%',
  },
  plusIcon: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    position: 'absolute',
    top: -19,
    left: -19,
    zIndex: 10,
  },
  accelerometerCircle: {
    width: 60,
    height: 60,
    position: 'absolute',
  },
  numberCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    color: 'white',
    fontWeight: '300',
    fontSize: 20,
  },
  labelCircle: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 40,
    fontWeight: '300',
    color: 'white',
  },
  txt: {
    color: '#fff',
  },
  txtDegree: {
    color: 'white',
    fontSize: 100,
    fontWeight: '200',
    textAlign: 'center',
    marginTop: 100,
  },
});
