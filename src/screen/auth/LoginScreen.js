import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import WrapperComp from '../../components/WrapperComp';
import { socialLoginData } from '../../constant/authData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
  const navigation = useNavigation();

  const googleLoginHandler = async () => {
    try {
      GoogleSignin.configure({
        scopes: ['https://www.googleapis.com/auth/drive'],
        webClientId:
          '298950216382-2qgfk6trdt5e528jtpbuk6v1gurcbhu0.apps.googleusercontent.com',
        iosClientId:
          '298950216382-ogkjd2gpvik3q2r4eufq8h9mu90jhg0i.apps.googleusercontent.com ',
        offlineAccess: true,
        forceCodeForRefreshToken: true,
        profileImageSize: 120,
      });

      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Google User Info:', userInfo);
      if (userInfo.type === 'success') {
        await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo.data));
        navigation.navigate('Home', {
          loginData: userInfo.data,
        });
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };

  const fbLoginHandler = async () => {
    return { user: 'Facebook User' };
  };

  const linkedinLoginHandler = async () => {};

  const twitterLoginHandler = async () => {
    return { user: 'Twitter User' };
  };

  const socialLogin = async title => {
    if (title === 'Google Login') {
      await googleLoginHandler();
    } else if (title === 'FaceBook Login') {
      const res = await fbLoginHandler();
      if (res !== null && res !== undefined) {
        navigation.navigate('Home');
      }
    } else if (title === 'Linkedin Login') {
      await linkedinLoginHandler();
    } else if (title === 'Twitter Login') {
      const res = await twitterLoginHandler();
      if (res !== null && res !== undefined) {
        navigation.navigate('Home');
      }
    }
  };

  return (
    <WrapperComp>
      <View style={styles.container}>
        <Text style={styles.loginScreen}>Welcome to the Login Page</Text>
        <Image
          source={{
            uri: 'https://static.vecteezy.com/system/resources/previews/023/654/784/non_2x/golden-logo-template-free-png.png',
          }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 1 }}>
        {socialLoginData.map(item => (
          <TouchableOpacity
            style={styles.btnStyles}
            key={item.id}
            activeOpacity={0.7}
            onPress={() => socialLogin(item.title)}
          >
            <Image source={{ uri: item.image }} style={{ ...styles.logo }} />
            <Text style={styles.btnText}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </WrapperComp>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 40,
  },
  image: {
    width: '80%',
    height: 350,
    borderRadius: 10,
    padding: 15,
    alignSelf: 'center',
  },

  loginScreen: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  btnStyles: {
    width: '70%',
    height: 50,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginRight: 10,
    borderRadius: 12,
  },

  btnText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 5,
    color: '#fff',
  },
});
