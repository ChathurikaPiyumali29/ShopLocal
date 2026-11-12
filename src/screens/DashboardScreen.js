
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
    (sum, item) => sum + Number(item.quantity || 0), 0
  );

  const inventoryValue = products.reduce(
    (sum, item) =>
      sum + Number(item.buyPrice || 0) * Number(item.quantity || 0),
    0
  );

  const today = new Date().toDateString();

  const todaySales = sales
    .filter(item => new Date(item.date).toDateString() === today)
    .reduce((sum, item) => sum + Number(item.total || 0), 0);

  const lowStock = products.filter(
    item => Number(item.quantity) <= 5
  );

  const StatCard = ({ title, value, icon, color }) => (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>

      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.number}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appName}>ShopLocal</Text>
        <Text style={styles.heading}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Welcome back! Here's your shop overview.
        </Text>
      </View>

      {/* Summary Cards */}
      <Text style={styles.section}>Business Overview</Text>

      <View style={styles.cardContainer}>

        <StatCard
          title="Total Products"
          value={totalProducts}
          icon="📦"
          color="#E2F4E9"
        />

        <StatCard
          title="Total Stock"
          value={totalStock}
          icon="📊"
          color="#E5F0FF"
        />

        <StatCard
          title="Inventory Value"
          value={`Rs. ${inventoryValue.toFixed(2)}`}
          icon="💰"
          color="#FFF1D6"
        />

        <StatCard
          title="Today's Sales"
          value={`Rs. ${todaySales.toFixed(2)}`}
          icon="🛒"
          color="#F0E5FF"
        />

      </View>

      {/* Low Stock Section */}
      <View style={styles.stockHeader}>
        <Text style={styles.section}>Low Stock Alerts</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {lowStock.length}
          </Text>
        </View>
      </View>

      {lowStock.length === 0 ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>
            ✓ All products have sufficient stock!
          </Text>
        </View>
      ) : (
        lowStock.map(item => (
          <View key={item.id} style={styles.alert}>
            <View>
              <Text style={styles.productName}>
                {item.name}
              </Text>
              <Text style={styles.remaining}>
                Remaining stock: {item.quantity}
              </Text>
            </View>

            <Text style={styles.warning}>⚠️</Text>
          </View>
        ))
      )}

      <Text style={styles.footer}>
        ShopLocal - Manage your business easily
      </Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    backgroundColor: '#174D3C',
    padding: 25,
    borderRadius: 18,
    marginBottom: 25,
  },

  appName: {
    color: '#A9D9BD',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
  },

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: 'white',
  },

  subtitle: {
    color: '#D8E9DF',
    marginTop: 8,
    fontSize: 14,
  },

  section: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 15,
  },

  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  card: {
    backgroundColor: 'white',
    width: '48%',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  icon: {
    fontSize: 21,
  },

  cardTitle: {
    color: '#777',
    fontSize: 13,
    marginBottom: 8,
  },

  number: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#174D3C',
  },

  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },

  badge: {
    backgroundColor: '#FFE0E0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginLeft: 10,
    marginBottom: 15,
  },

  badgeText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },

  alert: {
    backgroundColor: '#FFF0F0',
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  productName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },

  remaining: {
    color: '#777',
    marginTop: 5,
    fontSize: 13,
  },

  warning: {
    fontSize: 20,
  },

  successBox: {
    backgroundColor: '#E2F4E9',
    padding: 16,
    borderRadius: 10,
  },

  successText: {
    color: '#174D3C',
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    color: '#999',
    marginTop: 30,
    fontSize: 12,
  },
});
