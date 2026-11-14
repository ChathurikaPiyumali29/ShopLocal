
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { sampleProducts } from '../data/sampleData';

const ShopContext = createContext();

const generateId = () =>
  Date.now().toString() +
  Math.random().toString(36).slice(2, 9);

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierProducts, setSupplierProducts] = useState([]);
  const [returns, setReturns] = useState([]);
  const [ready, setReady] = useState(false);

  // Load data from AsyncStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        const keys = [
          'products',
          'sales',
          'suppliers',
          'supplierProducts',
          'returns',
        ];

        const stored = await AsyncStorage.multiGet(keys);
        const saved = Object.fromEntries(stored);

        const readArray = (key, fallback) => {
          if (saved[key] === null) return fallback;

          try {
            const value = JSON.parse(saved[key]);
            return Array.isArray(value) ? value : fallback;
          } catch (error) {
            console.log('Invalid stored data:', key, error);
            return fallback;
          }
        };

        setProducts(readArray('products', sampleProducts));
        setSales(readArray('sales', []));
        setSuppliers(readArray('suppliers', []));
        setSupplierProducts(readArray('supplierProducts', []));
        setReturns(readArray('returns', []));
      } catch (error) {
        console.log('Loading error:', error);
      } finally {
        setReady(true);
      }
    };

    loadData();
  }, []);

  // Save shop products
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(
      'products',
      JSON.stringify(products)
    ).catch(error => console.log('Products save error:', error));
  }, [products, ready]);

  // Save sales
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(
      'sales',
      JSON.stringify(sales)
    ).catch(error => console.log('Sales save error:', error));
  }, [sales, ready]);

  // Save suppliers
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(
      'suppliers',
      JSON.stringify(suppliers)
    ).catch(error => console.log('Suppliers save error:', error));
  }, [suppliers, ready]);

  // Save supplier products separately
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(
      'supplierProducts',
      JSON.stringify(supplierProducts)
    ).catch(error =>
      console.log('Supplier products save error:', error)
    );
  }, [supplierProducts, ready]);

  // Save customer returns
  useEffect(() => {
    if (!ready) return;

    AsyncStorage.setItem(
      'returns',
      JSON.stringify(returns)
    ).catch(error =>
      console.log('Returns save error:', error)
    );
  }, [returns, ready]);

  // SUPPLIER MANAGEMENT

  const addSupplier = (data) => {
    const supplier = {
      ...data,
      id: generateId(),
    };

    setSuppliers(previous => [...previous, supplier]);

    return { success: true, supplier };
  };

  const updateSupplier = (id, data) => {
    const exists = suppliers.some(item => item.id === id);

    if (!exists) {
      return {
        success: false,
        message: 'Supplier not found.',
      };
    }

    setSuppliers(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, ...data, id }
          : item
      )
    );

    return { success: true };
  };

  const deleteSupplier = (id) => {
    const exists = suppliers.some(item => item.id === id);

    if (!exists) {
      return {
        success: false,
        message: 'Supplier not found.',
      };
    }

    const linkedToShop = products.some(
      item => item.supplierId === id
    );

    const linkedToSupplierProducts = supplierProducts.some(
      item => item.supplierId === id
    );

    if (linkedToShop || linkedToSupplierProducts) {
      return {
        success: false,
        message:
          'Remove linked products before deleting this supplier.',
      };
    }

    setSuppliers(previous =>
      previous.filter(item => item.id !== id)
    );

    return { success: true };
  };

  // SUPPLIER PRODUCT MANAGEMENT

  const addSupplierProduct = (data) => {
    const exists = suppliers.some(
      item => item.id === data.supplierId
    );

    if (!exists) {
      return {
        success: false,
        message: 'Supplier not found.',
      };
    }

    const product = {
      ...data,
      id: generateId(),
    };

    setSupplierProducts(previous => [
      ...previous,
      product,
    ]);

    return { success: true, product };
  };

  const updateSupplierProduct = (id, data) => {
    const exists = supplierProducts.some(
      item => item.id === id
    );

    if (!exists) {
      return {
        success: false,
        message: 'Supplier product not found.',
      };
    }

    setSupplierProducts(previous =>
      previous.map(item =>
        item.id === id
          ? { ...item, ...data, id }
          : item
      )
    );

    return { success: true };
  };

  const deleteSupplierProduct = (id) => {
    const exists = supplierProducts.some(
      item => item.id === id
    );

    if (!exists) {
      return {
        success: false,
        message: 'Supplier product not found.',
      };
    }

    setSupplierProducts(previous =>
      previous.filter(item => item.id !== id)
    );

    return { success: true };
  };

  // CUSTOMER RETURNS MANAGEMENT

  const getReturnedQuantity = (saleId) => {
    return returns
      .filter(item => item.saleId === saleId)
      .reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0
      );
  };

  const recordReturn = (data) => {
    const sale = sales.find(
      item => item.id === data.saleId
    );

    if (!sale) {
      return {
        success: false,
        message: 'Original sale not found.',
      };
    }

    const quantity = Number(data.quantity);
    const soldQuantity = Number(sale.quantity);
    const alreadyReturned = getReturnedQuantity(sale.id);
    const remaining = soldQuantity - alreadyReturned;

    if (!Number.isInteger(quantity) || quantity <= 0) {
      return {
        success: false,
        message: 'Enter a valid return quantity.',
      };
    }

    if (quantity > remaining) {
      return {
        success: false,
        message:
          'Only ' + remaining + ' item(s) can still be returned.',
      };
    }

    if (!data.reason || !data.reason.trim()) {
      return {
        success: false,
        message: 'Please select a return reason.',
      };
    }

    // Original selling price per item.
    // Works with both new and previously saved sales.
    const unitPrice =
      Number(sale.quantity) > 0
        ? Number(sale.total) / Number(sale.quantity)
        : 0;

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return {
        success: false,
        message: 'The original sale amount is invalid.',
      };
    }

    const refundAmount = Number(
      (unitPrice * quantity).toFixed(2)
    );

    const newReturn = {
      id: generateId(),
      saleId: sale.id,
      productId: sale.productId,
      productName: sale.productName,
      quantity,
      reason: data.reason.trim(),
      notes: (data.notes || '').trim(),
      refundAmount,
      date: new Date().toISOString(),
      condition: 'Not for resale',
    };

    setReturns(previous => [newReturn, ...previous]);

    // Defective products are not added back to shop stock.

    return {
      success: true,
      returnedItem: newReturn,
    };
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        sales,
        setSales,
        suppliers,
        setSuppliers,
        supplierProducts,
        returns,
        ready,

        addSupplier,
        updateSupplier,
        deleteSupplier,

        addSupplierProduct,
        updateSupplierProduct,
        deleteSupplierProduct,

        getReturnedQuantity,
        recordReturn,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
