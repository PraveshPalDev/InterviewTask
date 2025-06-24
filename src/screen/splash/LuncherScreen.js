import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import WrapperComp from '../../components/WrapperComp';
import { useNavigation } from '@react-navigation/native';

export default function LuncherScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <WrapperComp>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://w7.pngwing.com/pngs/344/176/png-transparent-react-react-native-logos-brands-in-colors-icon-thumbnail.png',
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </WrapperComp>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },

  image: {
    width: '80%',
    height: 400,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 15,
  },
});
