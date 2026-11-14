
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  StyleSheet,
} from 'react-native';

import { useShop } from '../context/ShopContext';

const showMessage = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(title + '\n' + message);
  } else {
    Alert.alert(title, message);
  }
};

export default function SalesScreen({ navigation }) {
  const {
    products,
    setProducts,
    sales,
    setSales,
    returns,
    getReturnedQuantity,
  } = useShop();

  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState('1');

  const selectedProduct = products.find(
    item => item.id === selectedId
  );

  const recordSale = () => {
    const qty = Number(quantity);

    if (!selectedProduct) {
      showMessage('Error', 'Please select a product.');
      return;
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      showMessage('Error', 'Enter a valid quantity.');
      return;
    }

    if (qty > Number(selectedProduct.quantity)) {
      showMessage('Error', 'Not enough stock available.');
      return;
    }

    const unitPrice = Number(selectedProduct.sellPrice);

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      showMessage('Error', 'Invalid selling price.');
      return;
    }

    const total = qty * unitPrice;

    const newSale = {
      id:
        Date.now().toString() +
        Math.random().toString(36).slice(2, 8),
      productId: selectedId,
      productName: selectedProduct.name,
      quantity: qty,
      unitPrice,
      total,
      date: new Date().toISOString(),
    };

    setProducts(previous =>
      previous.map(item =>
        item.id === selectedId
          ? {
              ...item,
              quantity: Number(item.quantity) - qty,
            }
          : item
      )
    );

    setSales(previous => [newSale, ...previous]);

    showMessage(
      'Success',
      'Sale recorded successfully!\nTotal: Rs. ' +
        total.toFixed(2)
    );

    setQuantity('1');
    setSelectedId('');
  };

  const totalSales = sales.reduce(
    (sum, item) => sum + Number(item.total || 0),
    0
  );

  const totalRefunds = returns.reduce(
    (sum, item) => sum + Number(item.refundAmount || 0),
    0
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Record a Sale</Text>

      <Text style={styles.label}>Select Product</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.productList}
      >
        {products.map(item => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.product,
              selectedId === item.id && styles.selected,
            ]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.productName}>{item.name}</Text>
            <Text>Rs. {item.sellPrice}</Text>
            <Text>Stock: {item.quantity}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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

      <Text style={styles.heading}>Sales Summary</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Sales: Rs. {totalSales.toFixed(2)}
        </Text>

        <Text style={styles.summaryText}>
          Total Refunds: Rs. {totalRefunds.toFixed(2)}
        </Text>

        <Text style={styles.netText}>
          Net Revenue: Rs. {(totalSales - totalRefunds).toFixed(2)}
        </Text>
      </View>

      <Text style={styles.heading}>Sales History</Text>

      {sales.length === 0 ? (
        <Text>No sales recorded yet.</Text>
      ) : (
        sales.map(item => {
          const returned = getReturnedQuantity(item.id);
          const remaining = Number(item.quantity) - returned;

          return (
            <View key={item.id} style={styles.sale}>
              <Text style={styles.saleName}>
                {item.productName}
              </Text>

              <Text style={styles.info}>
                Quantity Sold: {item.quantity}
              </Text>

              <Text style={styles.info}>
                Revenue: Rs. {Number(item.total).toFixed(2)}
              </Text>

              <Text style={styles.info}>
                Returned Quantity: {returned}
              </Text>

              <Text style={styles.info}>
                Date: {new Date(item.date).toLocaleDateString()}
              </Text>

              {remaining > 0 ? (
                <TouchableOpacity
                  style={styles.returnButton}
                  onPress={() =>
                    navigation.navigate('Returns', {
                      saleId: item.id,
                    })
                  }
                >
                  <Text style={styles.buttonText}>
                    Return Product
                  </Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.returnedLabel}>
                  Fully Returned
                </Text>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7F5',
  },
  content: {
    padding: 15,
    paddingBottom: 35,
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
    color: '#333',
  },
  productList: {
    marginBottom: 12,
    flexGrow: 0,
  },
  product: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    marginRight: 10,
    borderRadius: 10,
    minWidth: 125,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  selected: {
    backgroundColor: '#A8D5BC',
    borderColor: '#174D3C',
  },
  productName: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 13,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDDDDD',
  },
  button: {
    backgroundColor: '#174D3C',
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  summary: {
    backgroundColor: '#E2F1E8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 15,
    color: '#174D3C',
    marginBottom: 7,
  },
  netText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174D3C',
  },
  sale: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  saleName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 8,
  },
  info: {
    color: '#555',
    marginBottom: 5,
  },
  returnButton: {
    backgroundColor: '#C47B21',
    padding: 12,
    borderRadius: 9,
    marginTop: 10,
    alignItems: 'center',
  },
  returnedLabel: {
    color: '#B45309',
    fontWeight: 'bold',
    marginTop: 10,
  },
});
