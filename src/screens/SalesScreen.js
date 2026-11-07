
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function SalesScreen() {
  const {
    products,
    setProducts,
    sales,
    setSales,
  } = useShop();

  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const selectedProduct = products.find(
    item => item.id === selectedId
  );

  const recordSale = () => {
    const qty = Number(quantity);

    if (!selectedProduct) {
      Alert.alert('Error', 'Please select a product');
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      Alert.alert('Error', 'Enter a valid quantity');
      return;
    }

    if (qty > Number(selectedProduct.quantity)) {
      Alert.alert('Error', 'Not enough stock available');
      return;
    }

    const total = qty * Number(selectedProduct.sellPrice);

    const newSale = {
      id: Date.now().toString(),
      productId: selectedId,
      productName: selectedProduct.name,
      quantity: qty,
      total: total,
      date: new Date().toISOString(),
    };

    // Reduce available stock
    setProducts(
      products.map(item =>
        item.id === selectedId
          ? {
              ...item,
              quantity: Number(item.quantity) - qty,
            }
          : item
      )
    );

    // Save sales record
    setSales([newSale, ...sales]);

    Alert.alert(
      'Success',
      'Sale recorded successfully!\nTotal: Rs. ' + total
    );

    setQuantity('1');
    setSelectedId('');
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Record a Sale</Text>

      <Text style={styles.label}>Select Product</Text>

      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.product,
              selectedId === item.id && styles.selected,
            ]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text>{item.name}</Text>
            <Text>Rs. {item.sellPrice}</Text>
            <Text>Stock: {item.quantity}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedProduct && (
        <Text style={styles.label}>
          Selected: {selectedProduct.name}
        </Text>
      )}

      <Text style={styles.label}>Quantity Sold</Text>

      <TextInput
        style={styles.input}
        keyboardType="number-pad"
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Enter quantity"
      />

      <TouchableOpacity
        style={styles.button}
        onPress={recordSale}
      >
        <Text style={styles.buttonText}>Record Sale</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Sales History</Text>

      <FlatList
        data={sales}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text>No sales recorded yet.</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.sale}>
            <Text style={styles.saleName}>
              {item.productName}
            </Text>

            <Text>Quantity: {item.quantity}</Text>

            <Text>Revenue: Rs. {item.total}</Text>

            <Text>
              Date: {new Date(item.date).toLocaleDateString()}
            </Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 15,
  },
  heading: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#174D3C',
    marginVertical: 12,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 8,
  },
  product: {
    backgroundColor: 'white',
    padding: 13,
    marginRight: 10,
    borderRadius: 10,
    minWidth: 110,
  },
  selected: {
    backgroundColor: '#A8D5BC',
    borderWidth: 1,
    borderColor: '#174D3C',
  },
  input: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sale: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  saleName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#174D3C',
  },
});
