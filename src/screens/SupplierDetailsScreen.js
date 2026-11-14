
import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function SupplierDetailsScreen({
  route,
  navigation,
}) {
  const {
    suppliers,
    supplierProducts,
    deleteSupplierProduct,
  } = useShop();

  const supplierId = route.params?.supplierId;

  const supplier = suppliers.find(
    item => item.id === supplierId
  );

  const suppliedProducts = supplierProducts.filter(
    item => item.supplierId === supplierId
  );

  const handleDelete = (product) => {
    const removeProduct = () => {
      const result = deleteSupplierProduct(product.id);

      if (!result.success) {
        if (Platform.OS === 'web') {
          window.alert(result.message);
        } else {
          Alert.alert('Error', result.message);
        }
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Delete ' + product.name + '?')) {
        removeProduct();
      }
    } else {
      Alert.alert(
        'Delete Product',
        'Are you sure you want to delete ' + product.name + '?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: removeProduct,
          },
        ]
      );
    }
  };

  if (!supplier) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Supplier not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Supplier Details</Text>

      <View style={styles.card}>
        <Text style={styles.supplierName}>
          {supplier.name}
        </Text>

        <Text style={styles.info}>
          Contact: {supplier.contactPerson}
        </Text>

        <Text style={styles.info}>
          Phone: {supplier.phone}
        </Text>

        <Text style={styles.info}>
          Email: {supplier.email || 'N/A'}
        </Text>

        <Text style={styles.info}>
          Address: {supplier.address}
        </Text>

        <Text style={styles.info}>
          Supplied Products: {suppliedProducts.length}
        </Text>

        <TouchableOpacity
          style={styles.editSupplierButton}
          onPress={() =>
            navigation.navigate('SupplierForm', {
              supplierId: supplier.id,
            })
          }
        >
          <Text style={styles.buttonText}>Edit Supplier</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subheading}>Products Supplied</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('SupplierProductForm', {
            supplierId: supplier.id,
          })
        }
      >
        <Text style={styles.buttonText}>
          + Add Supplied Product
        </Text>
      </TouchableOpacity>

      {suppliedProducts.length === 0 ? (
        <Text style={styles.empty}>
          No supplied products yet. Add your first product!
        </Text>
      ) : (
        suppliedProducts.map(product => (
          <View key={product.id} style={styles.productCard}>
            <Text style={styles.productName}>
              {product.name}
            </Text>

            <Text style={styles.info}>
              Category: {product.category}
            </Text>

            <Text style={styles.info}>
              Buying Price: Rs. {product.buyPrice}
            </Text>

            <Text style={styles.info}>
              Selling Price: Rs. {product.sellPrice}
            </Text>

            <Text style={styles.info}>
              Quantity: {product.quantity}
            </Text>

            {product.notes ? (
              <Text style={styles.info}>
                Notes: {product.notes}
              </Text>
            ) : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('SupplierProductForm', {
                    supplierId: supplier.id,
                    productId: product.id,
                  })
                }
              >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(product)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
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
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 24,
    elevation: 3,
  },
  supplierName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 12,
  },
  info: {
    fontSize: 15,
    color: '#444',
    marginBottom: 8,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  editSupplierButton: {
    backgroundColor: '#36856A',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#36856A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#C0392B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    marginTop: 20,
    marginBottom: 30,
  },
});
