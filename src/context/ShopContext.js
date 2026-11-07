
import React, {
  createContext,
  useState,
  useEffect,
  useContext,
} from 'react';

import AsyncStorage from
  '@react-native-async-storage/async-storage';

import { sampleProducts } from '../data/sampleData';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [ready, setReady] = useState(false);

  // Load saved data
  useEffect(() => {
    const loadData = async () => {
      try {
        const savedProducts =
          await AsyncStorage.getItem('products');

        const savedSales =
          await AsyncStorage.getItem('sales');

        setProducts(
          savedProducts
            ? JSON.parse(savedProducts)
            : sampleProducts
        );

        setSales(
          savedSales ? JSON.parse(savedSales) : []
        );
      } catch (error) {
        console.log('Loading error:', error);
        setProducts(sampleProducts);
      } finally {
        setReady(true);
      }
    };

    loadData();
  }, []);

  // Save data whenever it changes
  useEffect(() => {
    if (!ready) return;

    const saveData = async () => {
      try {
        await AsyncStorage.setItem(
          'products',
          JSON.stringify(products)
        );

        await AsyncStorage.setItem(
          'sales',
          JSON.stringify(sales)
        );
      } catch (error) {
        console.log('Saving error:', error);
      }
    };

    saveData();
  }, [products, sales, ready]);

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        sales,
        setSales,
        ready,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
