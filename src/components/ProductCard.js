
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.details}>
        <Text style={styles.name}>
          {product.name}
        </Text>

        <Text style={styles.category}>
          {product.category}
        </Text>

        <Text style={styles.price}>
          Selling Price: Rs. {product.sellPrice}
        </Text>

        <Text style={styles.quantity}>
          Available Stock: {product.quantity}
        </Text>
      </View>

      <Text style={styles.arrow}>View →</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
  },

  details: {
    flex: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174D3C',
  },

  category: {
    fontSize: 13,
    color: 'gray',
    marginTop: 4,
  },

  price: {
    fontSize: 15,
    marginTop: 8,
  },

  quantity: {
    fontSize: 14,
    color: '#555555',
    marginTop: 4,
  },

  arrow: {
    color: '#174D3C',
    fontWeight: 'bold',
  },
});
