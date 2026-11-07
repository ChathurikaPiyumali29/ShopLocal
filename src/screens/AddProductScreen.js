
import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function AddProductScreen({
  route,
  navigation,
}) {
  const { products, setProducts } = useShop();

  const productId = route.params?.productId;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Food');
  const [buyPrice, setBuyPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  useEffect(() => {
    if (productId) {
      const product = products.find(
        item => item.id === productId
      );

      if (product) {
        setName(product.name);
        setCategory(product.category);
        setBuyPrice(String(product.buyPrice));
        setSellPrice(String(product.sellPrice));
        setQuantity(String(product.quantity));
      }
    }
  }, [productId, products]);

  const saveProduct = () => {
    if (
      !name.trim() ||
      !buyPrice.trim() ||
      !sellPrice.trim() ||
      !quantity.trim()
    ) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const buy = Number(buyPrice);
    const sell = Number(sellPrice);
    const stock = Number(quantity);

    if (
      !Number.isFinite(buy) ||
      !Number.isFinite(sell) ||
      !Number.isInteger(stock) ||
      buy <= 0 ||
      sell <= 0 ||
      stock < 0
    ) {
      Alert.alert('Error', 'Enter valid prices and quantity');
      return;
    }

    const newProduct = {
      id: productId || Date.now().toString(),
      name: name.trim(),
      category,
      buyPrice: buy,
      sellPrice: sell,
      quantity: stock,
    };

    if (productId) {
      setProducts(
        products.map(item =>
          item.id === productId ? newProduct : item
        )
      );
    } else {
      setProducts([...products, newProduct]);
    }

    Alert.alert('Success', 'Product saved successfully');

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        {productId ? 'Edit Product' : 'Add New Product'}
      </Text>

      <Text>Product Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter product name"
        value={name}
        onChangeText={setName}
      />

      <Text>Category</Text>

      <View style={styles.categories}>
        {['Food', 'Personal Care', 'Stationery'].map(item => (
          <TouchableOpacity
            key={item}
            style={[
              styles.category,
              category === item && styles.selected,
            ]}
            onPress={() => setCategory(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text>Buying Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter buying price"
        keyboardType="decimal-pad"
        value={buyPrice}
        onChangeText={setBuyPrice}
      />

      <Text>Selling Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter selling price"
        keyboardType="decimal-pad"
        value={sellPrice}
        onChangeText={setSellPrice}
      />

      <Text>Available Quantity</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter quantity"
        keyboardType="number-pad"
        value={quantity}
        onChangeText={setQuantity}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={saveProduct}
      >
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
    padding: 20,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 20,
  },
  input: {
    backgroundColor: 'white',
    padding: 13,
    borderRadius: 8,
    marginTop: 7,
    marginBottom: 15,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 10,
  },
  category: {
    backgroundColor: '#E5EAE7',
    padding: 10,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  selected: {
    backgroundColor: '#A8D5BC',
  },
  button: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
