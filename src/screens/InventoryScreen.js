
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function InventoryScreen({ navigation }) {
  const { products } = useShop();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const categories = [
    'All',
    'Food',
    'Personal Care',
    'Stationery',
  ];

  const filteredProducts = products.filter(item => {
    const matchName = item.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === 'All' || item.category === category;

    return matchName && matchCategory;
  });

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.search}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
      />

      <View style={styles.categories}>
        {categories.map(item => (
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

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}
      >
        <Text style={styles.buttonText}>+ Add Product</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          <Text style={styles.empty}>No products found.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.product}
            onPress={() =>
              navigation.navigate('ProductDetails', {
                productId: item.id,
              })
            }
          >
            <Text style={styles.name}>{item.name}</Text>

            <Text>Category: {item.category}</Text>

            <Text>Price: Rs. {item.sellPrice}</Text>

            <Text>Stock: {item.quantity}</Text>

            <Text style={styles.view}>View Details →</Text>
          </TouchableOpacity>
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
  search: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  category: {
    backgroundColor: '#E5EAE7',
    padding: 9,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 6,
  },
  selected: {
    backgroundColor: '#A8D5BC',
  },
  addButton: {
    backgroundColor: '#174D3C',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  product: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174D3C',
  },
  view: {
    color: '#174D3C',
    marginTop: 8,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
  },
});
