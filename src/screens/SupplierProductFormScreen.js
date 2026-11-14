
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function SupplierProductFormScreen({
  route,
  navigation,
}) {
  const {
    suppliers,
    supplierProducts,
    addSupplierProduct,
    updateSupplierProduct,
  } = useShop();

  const supplierId = route.params?.supplierId;
  const productId = route.params?.productId;

  const supplier = suppliers.find(
    item => item.id === supplierId
  );

  const existingProduct = supplierProducts.find(
    item =>
      item.id === productId &&
      item.supplierId === supplierId
  );

  const isEditing = Boolean(productId);

  const [name, setName] = useState(
    existingProduct?.name || ''
  );

  const [category, setCategory] = useState(
    existingProduct?.category || ''
  );

  const [buyPrice, setBuyPrice] = useState(
    existingProduct?.buyPrice?.toString() || ''
  );

  const [sellPrice, setSellPrice] = useState(
    existingProduct?.sellPrice?.toString() || ''
  );

  const [quantity, setQuantity] = useState(
    existingProduct?.quantity?.toString() || ''
  );

  const [notes, setNotes] = useState(
    existingProduct?.notes || ''
  );

  const showMessage = (title, message) => {
    if (Platform.OS === 'web') {
      window.alert(title + ': ' + message);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleSave = () => {
    if (!supplier) {
      showMessage('Error', 'Supplier not found.');
      return;
    }

    if (isEditing && !existingProduct) {
      showMessage('Error', 'Product not found.');
      return;
    }

    if (
      !name.trim() ||
      !category.trim() ||
      !buyPrice.trim() ||
      !sellPrice.trim() ||
      !quantity.trim()
    ) {
      showMessage('Error', 'Please fill all required fields.');
      return;
    }

    const buying = Number(buyPrice);
    const selling = Number(sellPrice);
    const stock = Number(quantity);

    if (
      !Number.isFinite(buying) ||
      !Number.isFinite(selling) ||
      buying < 0 ||
      selling < 0
    ) {
      showMessage('Error', 'Enter valid prices.');
      return;
    }

    if (
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      showMessage('Error', 'Quantity must be a whole number.');
      return;
    }

    const productData = {
      supplierId,
      name: name.trim(),
      category: category.trim(),
      buyPrice: buying,
      sellPrice: selling,
      quantity: stock,
      notes: notes.trim(),
    };

    const result = isEditing
      ? updateSupplierProduct(productId, productData)
      : addSupplierProduct(productData);

    if (!result.success) {
      showMessage('Error', result.message);
      return;
    }

    showMessage(
      'Success',
      isEditing
        ? 'Supplier product updated successfully.'
        : 'Supplier product added successfully.'
    );

    navigation.goBack();
  };

  if (!supplier || (isEditing && !existingProduct)) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Supplier or product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>
        {isEditing ? 'Edit Supplied Product' : 'Add Supplied Product'}
      </Text>

      <Text style={styles.subtitle}>
        Supplier: {supplier.name}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Product Name *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Blue Pen"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Category *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Stationery"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Buying Price (Rs.) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 20"
          keyboardType="decimal-pad"
          value={buyPrice}
          onChangeText={setBuyPrice}
        />

        <Text style={styles.label}>Selling Price (Rs.) *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 30"
          keyboardType="decimal-pad"
          value={sellPrice}
          onChangeText={setSellPrice}
        />

        <Text style={styles.label}>Available Quantity *</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: 100"
          keyboardType="number-pad"
          value={quantity}
          onChangeText={setQuantity}
        />

        <Text style={styles.label}>Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.notes]}
          placeholder="Product details"
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {isEditing ? 'Update Product' : 'Save Product'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F8F5',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
    elevation: 3,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  notes: {
    height: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 30,
  },
});
