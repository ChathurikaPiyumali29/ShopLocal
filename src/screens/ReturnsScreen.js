
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

const reasons = [
  'Quality Defect',
  'Damaged Product',
  'Expired Product',
  'Wrong Item',
  'Other',
];

const showMessage = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(title + '\n' + message);
  } else {
    Alert.alert(title, message);
  }
};

export default function ReturnsScreen({ route }) {
  const {
    sales,
    returns,
    getReturnedQuantity,
    recordReturn,
  } = useShop();

  const [selectedSaleId, setSelectedSaleId] = useState(
    route.params?.saleId || ''
  );

  const [quantity, setQuantity] = useState('1');
  const [reason, setReason] = useState('Quality Defect');
  const [notes, setNotes] = useState('');

  const selectedSale = sales.find(
    item => item.id === selectedSaleId
  );

  const alreadyReturned = selectedSale
    ? getReturnedQuantity(selectedSale.id)
    : 0;

  const remaining = selectedSale
    ? Number(selectedSale.quantity) - alreadyReturned
    : 0;

  const refundablePerItem = selectedSale
    ? Number(selectedSale.total) / Number(selectedSale.quantity)
    : 0;

  const estimatedRefund =
    Number.isInteger(Number(quantity)) &&
    Number(quantity) > 0 &&
    Number(quantity) <= remaining
      ? refundablePerItem * Number(quantity)
      : 0;

  const totalRefunds = returns.reduce(
    (sum, item) => sum + Number(item.refundAmount || 0),
    0
  );

  const handleReturn = () => {
    if (!selectedSale) {
      showMessage('Error', 'Please select a sale.');
      return;
    }

    const result = recordReturn({
      saleId: selectedSale.id,
      quantity: Number(quantity),
      reason,
      notes,
    });

    if (!result.success) {
      showMessage('Error', result.message);
      return;
    }

    showMessage(
      'Success',
      'Return recorded successfully!\nRefund: Rs. ' +
        result.returnedItem.refundAmount.toFixed(2)
    );

    setSelectedSaleId('');
    setQuantity('1');
    setReason('Quality Defect');
    setNotes('');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.heading}>Customer Returns</Text>

      <Text style={styles.subtitle}>
        Record defective or damaged products returned by customers.
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Select Original Sale</Text>

        {sales.length === 0 ? (
          <Text style={styles.empty}>
            No sales recorded yet.
          </Text>
        ) : (
          sales.map(sale => {
            const returned = getReturnedQuantity(sale.id);
            const available = Number(sale.quantity) - returned;
            const selected = selectedSaleId === sale.id;

            return (
              <TouchableOpacity
                key={sale.id}
                disabled={available <= 0}
                onPress={() => {
                  setSelectedSaleId(sale.id);
                  setQuantity('1');
                }}
                style={[
                  styles.saleOption,
                  selected && styles.selectedOption,
                  available <= 0 && styles.disabledOption,
                ]}
              >
                <Text style={styles.productName}>
                  {sale.productName}
                </Text>

                <Text style={styles.info}>
                  Sold: {sale.quantity} | Available to return: {available}
                </Text>

                <Text style={styles.info}>
                  Sale Amount: Rs. {Number(sale.total).toFixed(2)}
                </Text>

                <Text style={styles.info}>
                  Date: {new Date(sale.date).toLocaleDateString()}
                </Text>

                {available <= 0 && (
                  <Text style={styles.returnedLabel}>
                    Fully Returned
                  </Text>
                )}
              </TouchableOpacity>
            );
          })
        )}
      </View>

      {selectedSale && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Return Details</Text>

          <Text style={styles.label}>
            Product: {selectedSale.productName}
          </Text>

          <Text style={styles.label}>
            Maximum Return Quantity: {remaining}
          </Text>

          <Text style={styles.label}>Quantity to Return</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="Enter quantity"
            value={quantity}
            onChangeText={setQuantity}
          />

          <Text style={styles.label}>Return Reason</Text>

          <View style={styles.reasonContainer}>
            {reasons.map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.reasonButton,
                  reason === item && styles.selectedReason,
                ]}
                onPress={() => setReason(item)}
              >
                <Text
                  style={[
                    styles.reasonText,
                    reason === item && styles.selectedReasonText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Additional Notes</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Describe the problem"
            value={notes}
            onChangeText={setNotes}
            multiline
          />

          <View style={styles.refundBox}>
            <Text style={styles.refundLabel}>Refund Amount</Text>
            <Text style={styles.refundAmount}>
              Rs. {estimatedRefund.toFixed(2)}
            </Text>
          </View>

          <Text style={styles.warning}>
            Returned items will not be added back to shop stock.
          </Text>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleReturn}
          >
            <Text style={styles.buttonText}>Record Return</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.heading}>Return History</Text>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>
          Total Returns: {returns.length}
        </Text>
        <Text style={styles.summaryText}>
          Total Refunds: Rs. {totalRefunds.toFixed(2)}
        </Text>
      </View>

      {returns.length === 0 ? (
        <Text style={styles.empty}>No returns recorded yet.</Text>
      ) : (
        returns.map(item => (
          <View key={item.id} style={styles.returnCard}>
            <Text style={styles.productName}>
              {item.productName}
            </Text>

            <Text style={styles.info}>
              Quantity Returned: {item.quantity}
            </Text>

            <Text style={styles.info}>
              Reason: {item.reason}
            </Text>

            <Text style={styles.info}>
              Refund: Rs. {Number(item.refundAmount).toFixed(2)}
            </Text>

            <Text style={styles.info}>
              Date: {new Date(item.date).toLocaleDateString()}
            </Text>

            <Text style={styles.info}>
              Condition: {item.condition || 'Not for resale'}
            </Text>

            {item.notes ? (
              <Text style={styles.info}>
                Notes: {item.notes}
              </Text>
            ) : null}
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
  },
  content: {
    padding: 16,
    paddingBottom: 35,
  },
  heading: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 12,
  },
  subtitle: {
    color: '#666',
    fontSize: 14,
    marginBottom: 18,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 14,
  },
  saleOption: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    borderColor: '#174D3C',
    backgroundColor: '#E2F1E8',
    borderWidth: 2,
  },
  disabledOption: {
    opacity: 0.5,
  },
  productName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 7,
  },
  info: {
    color: '#555',
    fontSize: 14,
    marginBottom: 5,
  },
  returnedLabel: {
    color: '#B45309',
    fontWeight: 'bold',
    marginTop: 5,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#F7F7F7',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 12,
    borderRadius: 9,
    marginBottom: 16,
  },
  notesInput: {
    height: 85,
    textAlignVertical: 'top',
  },
  reasonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  reasonButton: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginRight: 7,
    marginBottom: 8,
  },
  selectedReason: {
    backgroundColor: '#174D3C',
    borderColor: '#174D3C',
  },
  reasonText: {
    color: '#444',
    fontSize: 13,
  },
  selectedReasonText: {
    color: '#FFFFFF',
  },
  refundBox: {
    backgroundColor: '#E2F1E8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 12,
  },
  refundLabel: {
    color: '#174D3C',
    fontWeight: 'bold',
  },
  refundAmount: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#174D3C',
    marginTop: 5,
  },
  warning: {
    color: '#B45309',
    marginBottom: 14,
    fontSize: 13,
  },
  saveButton: {
    backgroundColor: '#174D3C',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  summary: {
    backgroundColor: '#E2F1E8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#174D3C',
    marginBottom: 6,
  },
  returnCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },
  empty: {
    color: '#777',
    textAlign: 'center',
    padding: 20,
  },
});
