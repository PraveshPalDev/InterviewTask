import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import React from 'react';

export default function WrapperComp({ Styles, children }) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaView style={{ ...styles.container, Styles }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
