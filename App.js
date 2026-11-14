
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { ShopProvider, useShop } from './src/context/ShopContext';

import DashboardScreen from './src/screens/DashboardScreen';
import InventoryScreen from './src/screens/InventoryScreen';
import ProductDetailsScreen from './src/screens/ProductDetailsScreen';
import AddProductScreen from './src/screens/AddProductScreen';
import SalesScreen from './src/screens/SalesScreen';

import SupplierScreen from './src/screens/SupplierScreen';
import SupplierFormScreen from './src/screens/SupplierFormScreen';
import SupplierDetailsScreen from './src/screens/SupplierDetailsScreen';
import SupplierProductFormScreen from './src/screens/SupplierProductFormScreen';

// New Returns screen
import ReturnsScreen from './src/screens/ReturnsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabIcons = {
  Dashboard: ['grid', 'grid-outline'],
  Inventory: ['cube', 'cube-outline'],
  Sales: ['cart', 'cart-outline'],
  Returns: ['return-down-back', 'return-down-back-outline'],
  Suppliers: ['people', 'people-outline'],
};

function MainTabs() {
  const insets = useSafeAreaInsets();

  const bottomPadding =
    Platform.OS === 'web'
      ? 8
      : Math.max(insets.bottom, 8);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: '#174D3C',
        },
        headerTintColor: '#FFFFFF',

        tabBarActiveTintColor: '#174D3C',
        tabBarInactiveTintColor: '#777777',

        tabBarShowLabel: true,
        tabBarLabelPosition: 'below-icon',

        tabBarIcon: ({ focused, color }) => {
          const icons = tabIcons[route.name] || [
            'ellipse',
            'ellipse-outline',
          ];

          return (
            <Ionicons
              name={focused ? icons[0] : icons[1]}
              size={22}
              color={color}
            />
          );
        },

        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          height: 65 + bottomPadding,
          paddingTop: 7,
          paddingBottom: bottomPadding,
          borderTopWidth: 1,
          borderTopColor: '#DDDDDD',
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: 'bold',
          marginTop: 2,
        },

        tabBarItemStyle: {
          paddingVertical: 2,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
      />

      <Tab.Screen
        name="Sales"
        component={SalesScreen}
      />

      <Tab.Screen
        name="Returns"
        component={ReturnsScreen}
      />

      <Tab.Screen
        name="Suppliers"
        component={SupplierScreen}
      />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const { ready } = useShop();

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F4F8F5',
        }}
      >
        <ActivityIndicator
          size="large"
          color="#174D3C"
        />

        <Text style={{ marginTop: 10 }}>
          Loading ShopLocal...
        </Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#174D3C',
          },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Main"
          component={MainTabs}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{ title: 'Product Details' }}
        />

        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
          options={{ title: 'Add / Edit Product' }}
        />

        <Stack.Screen
          name="SupplierForm"
          component={SupplierFormScreen}
          options={{ title: 'Add / Edit Supplier' }}
        />

        <Stack.Screen
          name="SupplierDetails"
          component={SupplierDetailsScreen}
          options={{ title: 'Supplier Details' }}
        />

        <Stack.Screen
          name="SupplierProductForm"
          component={SupplierProductFormScreen}
          options={{ title: 'Supplied Product' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ShopProvider>
        <AppNavigation />
      </ShopProvider>
    </SafeAreaProvider>
  );
}
