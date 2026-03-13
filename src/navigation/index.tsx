import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { RootStackParamList } from '../types';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useAppTheme } from '../hooks/useAppTheme';

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  const { colors } = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
        },
        headerTintColor: '#000000',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({ 
          title: 'Explorer',
          headerRight: () => (
            <HeaderCartButton onPress={() => navigation.navigate('Cart')} />
          ),
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={({ navigation }) => ({ 
          title: 'Details',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 20, padding: 5 }}
            >
              <Text style={{ fontSize: 24, color: '#000000', fontWeight: 'bold' }}>‹</Text>
            </TouchableOpacity>
          ),
          headerRight: () => (
            <HeaderCartButton onPress={() => navigation.navigate('Cart')} />
          ),
        })}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={({ navigation }) => ({ 
          title: 'My Bag',
          headerLeft: () => (
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 20, padding: 5 }}
            >
              <Text style={{ fontSize: 24, color: '#000000', fontWeight: 'bold' }}>‹</Text>
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const HeaderCartButton = ({ onPress }: { onPress: () => void }) => {
  const { colors } = useAppTheme();
  const totalCount = useSelector((state: RootState) => state.cart.totalCount);

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.headerButton]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Text style={styles.iconText}>🛍️</Text>
        {totalCount > 0 && (
          <View style={[styles.badge, { backgroundColor: colors.danger }]}>
            <Text style={styles.badgeText}>
              {totalCount > 9 ? '9+' : totalCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  headerButton: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconText: {
    fontSize: 22,
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -5,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '900',
  },
});

export default MainStack;
