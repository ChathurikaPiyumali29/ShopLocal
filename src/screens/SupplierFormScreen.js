
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';

import { useShop } from '../context/ShopContext';

export default function SupplierFormScreen({ navigation, route }) {

  const shop = useShop();

  const suppliers = shop?.suppliers || [];
  const addSupplier = shop?.addSupplier;
  const updateSupplier = shop?.updateSupplier;

  const supplierId = route.params?.supplierId;

  // Find supplier when editing
  const existingSupplier = suppliers.find(
    item => item.id === supplierId
  );

  const [name, setName] = useState(
    existingSupplier?.name || ''
  );

  const [contactPerson, setContactPerson] = useState(
    existingSupplier?.contactPerson || ''
  );

  const [phone, setPhone] = useState(
    existingSupplier?.phone || ''
  );

  const [email, setEmail] = useState(
    existingSupplier?.email || ''
  );

  const [address, setAddress] = useState(
    existingSupplier?.address || ''
  );

  const handleSave = () => {

    if (
      !name.trim() ||
      !contactPerson.trim() ||
      !phone.trim() ||
      !address.trim()
    ) {
      Alert.alert(
        'Error',
        'Please fill all required fields'
      );
      return;
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert(
        'Error',
        'Phone number must contain 10 digits'
      );
      return;
    }

    if (
      email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    ) {
      Alert.alert(
        'Error',
        'Please enter a valid email'
      );
      return;
    }

    const supplierData = {
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
    };

    // Edit existing supplier
    if (supplierId) {

      if (typeof updateSupplier !== 'function') {
        Alert.alert(
          'Error',
          'Update supplier function is not available'
        );
        return;
      }

      updateSupplier(supplierId, supplierData);

      Alert.alert(
        'Success',
        'Supplier updated successfully'
      );

    } else {

      // Add new supplier
      if (typeof addSupplier !== 'function') {
        Alert.alert(
          'Error',
          'Add supplier function is not available'
        );
        return;
      }

      addSupplier(supplierData);

      Alert.alert(
        'Success',
        'Supplier added successfully'
      );
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.heading}>
        {supplierId ? 'Edit Supplier' : 'Add New Supplier'}
      </Text>

      <View style={styles.card}>

        <Text style={styles.label}>
          Supplier Name *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter supplier name"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>
          Contact Person *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter contact person"
          value={contactPerson}
          onChangeText={setContactPerson}
        />

        <Text style={styles.label}>
          Phone Number *
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>
          Address *
        </Text>

        <TextInput
          style={[styles.input, styles.addressInput]}
          placeholder="Enter address"
          multiline
          value={address}
          onChangeText={setAddress}
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>
            {supplierId ? 'Update Supplier' : 'Save Supplier'}
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
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    elevation: 3,
    marginBottom: 30,
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
    backgroundColor: '#FFFFFF',
    fontSize: 15,
  },

  addressInput: {
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

});
