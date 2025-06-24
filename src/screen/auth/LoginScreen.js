import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import WrapperComp from '../../components/WrapperComp';
import { socialLoginData } from '../../constant/authData';

export default function LoginScreen() {
  const socialLogin = title => {
    if (title === 'Google Login') {
      console.log('Google Login Pressed');
    } else if (title === 'FaceBook Login') {
      console.log('Facebook Login Pressed');
    } else if (title === 'Linkedin Login') {
      console.log('Facebook Login Pressed');
    } else if (title === 'Twitter Login') {
      console.log('Facebook Login Pressed');
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
    height: 400,
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
