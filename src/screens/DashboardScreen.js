
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function DashboardScreen() {
  const { products, sales } = useShop();

  const totalProducts = products.length;

  const totalStock = products.reduce(
    (sum, item) => sum + Number(item.quantity), 0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum + Number(item.buyPrice) * Number(item.quantity),
    0
  );

  const today = new Date().toDateString();

  const todaySales = sales
    .filter(item => new Date(item.date).toDateString() === today)
    .reduce((sum, item) => sum + Number(item.total), 0);

  const lowStock = products.filter(
    item => Number(item.quantity) <= 5
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Welcome to ShopLocal!</Text>
      <Text style={styles.subtitle}>
        Your shop overview
      </Text>

      <View style={styles.card}>
        <Text>Total Products</Text>
        <Text style={styles.number}>{totalProducts}</Text>
      </View>

      <View style={styles.card}>
        <Text>Total Stock Quantity</Text>
        <Text style={styles.number}>{totalStock}</Text>
      </View>

      <View style={styles.card}>
        <Text>Inventory Value</Text>
        <Text style={styles.number}>
          Rs. {inventoryValue.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text>Today's Sales</Text>
        <Text style={styles.number}>
          Rs. {todaySales.toFixed(2)}
        </Text>
      </View>

      <Text style={styles.section}>Low Stock Alerts</Text>

      {lowStock.length === 0 ? (
        <Text>All products have sufficient stock.</Text>
      ) : (
        lowStock.map(item => (
          <View key={item.id} style={styles.alert}>
            <Text>{item.name}</Text>
            <Text>Remaining: {item.quantity}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 15,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#174D3C',
  },
  subtitle: {
    color: 'gray',
    marginBottom: 20,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
  },
  number: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#174D3C',
    marginTop: 8,
  },
  section: {
    fontSize: 19,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
  },
  alert: {
    backgroundColor: '#FFE8E8',
    padding: 15,
    marginBottom: 8,
    borderRadius: 8,
  },
});
