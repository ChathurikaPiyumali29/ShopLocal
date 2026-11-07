
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function ProductDetailsScreen({
  route,
  navigation,
}) {
  const { products, setProducts } = useShop();

  const { productId } = route.params;

  const product = products.find(
    item => item.id === productId
  );

  if (!product) {
    return <Text>Product not found.</Text>;
  }

  const deleteProduct = () => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: () => {
            setProducts(
              products.filter(item => item.id !== productId)
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{product.name}</Text>

      <Text>Category: {product.category}</Text>

      <Text>Buying Price: Rs. {product.buyPrice}</Text>

      <Text>Selling Price: Rs. {product.sellPrice}</Text>

      <Text>Available Quantity: {product.quantity}</Text>

      <Text>
        Profit per Item: Rs. {
          Number(product.sellPrice) - Number(product.buyPrice)
        }
      </Text>

      <TouchableOpacity
        style={styles.edit}
        onPress={() =>
          navigation.navigate('AddProduct', {
            productId: product.id,
          })
        }
      >
        <Text style={styles.buttonText}>Edit Product</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.delete}
        onPress={deleteProduct}
      >
        <Text style={styles.buttonText}>Delete Product</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F7F5',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 20,
  },
  edit: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  delete: {
    backgroundColor: '#C0392B',
    padding: 15,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
