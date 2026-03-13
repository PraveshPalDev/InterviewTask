import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import CartScreen from '../screens/CartScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: '#f0f0f0',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerTintColor: '#333',
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen} 
        options={({ navigation }) => ({ 
          title: 'Product Explorer',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Cart')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 22 }}>🛍️</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen} 
        options={({ navigation }) => ({ 
          title: 'Product Details',
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => navigation.navigate('Cart')}
              style={{ marginRight: 15 }}
            >
              <Text style={{ fontSize: 22 }}>🛍️</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen 
        name="Cart" 
        component={CartScreen} 
        options={{ title: 'My Cart' }}
      />
    </Stack.Navigator>
  );
};

export default MainStack;
