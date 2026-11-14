
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function SupplierScreen({ navigation }) {

  const {
    suppliers = [],
    supplierProducts = [],
    deleteSupplier,
  } = useShop();

  // Delete supplier
  const handleDelete = (supplier) => {

    const confirmDelete = () => {

      const result = deleteSupplier(supplier.id);

      if (!result.success) {
        if (Platform.OS === 'web') {
          window.alert(result.message);
        } else {
          Alert.alert('Error', result.message);
        }
        return;
      }

      if (Platform.OS === 'web') {
        window.alert('Supplier deleted successfully!');
      } else {
        Alert.alert('Success', 'Supplier deleted successfully!');
      }
    };

    // Web confirmation
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Are you sure you want to delete ' +
        supplier.name + '?'
      );

      if (confirmed) {
        confirmDelete();
      }

    } else {

      // Android / iOS confirmation
      Alert.alert(
        'Delete Supplier',
        'Are you sure you want to delete ' +
        supplier.name + '?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: confirmDelete,
          },
        ]
      );
    }
  };

  const renderSupplier = ({ item }) => {

    const totalProducts = supplierProducts.filter(
      product => product.supplierId === item.id
    ).length;

    return (
      <View style={styles.card}>

        <Text style={styles.supplierName}>
          {item.name}
        </Text>

        <Text style={styles.info}>
          Contact: {item.contactPerson}
        </Text>

        <Text style={styles.info}>
          Phone: {item.phone}
        </Text>

        <Text style={styles.info}>
          Products Supplied: {totalProducts}
        </Text>

        <View style={styles.buttonRow}>

          <TouchableOpacity
            style={styles.viewButton}
            onPress={() =>
              navigation.navigate('SupplierDetails', {
                supplierId: item.id,
              })
            }
          >
            <Text style={styles.buttonText}>
              View
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() =>
              navigation.navigate('SupplierForm', {
                supplierId: item.id,
              })
            }
          >
            <Text style={styles.buttonText}>
              Edit
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item)}
          >
            <Text style={styles.buttonText}>
              Delete
            </Text>
          </TouchableOpacity>

        </View>

      </View>
    );
  };

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>
        Supplier Management
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate('SupplierForm')
        }
      >
        <Text style={styles.buttonText}>
          + Add New Supplier
        </Text>
      </TouchableOpacity>

      <FlatList
        data={suppliers}
        keyExtractor={item => item.id.toString()}
        renderItem={renderSupplier}
        contentContainerStyle={{ paddingBottom: 30 }}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No suppliers available. Add your first supplier!
          </Text>
        }
      />

    </View>
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

  addButton: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },

  supplierName: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 10,
  },

  info: {
    fontSize: 15,
    color: '#444',
    marginBottom: 6,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 15,
  },

  viewButton: {
    flex: 1,
    backgroundColor: '#36856A',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },

  editButton: {
    flex: 1,
    backgroundColor: '#E69A23',
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
    fontSize: 14,
    fontWeight: 'bold',
  },

  empty: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },

});
