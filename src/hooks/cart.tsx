import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const productsFromAsync = await AsyncStorage.getItem('@goM:products');
      setProducts(JSON.parse(productsFromAsync) || []);
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(async product => {
    setProducts(state => {
      const finded = state.find(item => item.id === product.id);
      const arrProducts = !!finded 
        ? state.map(item => item.id === product.id 
            ? {...item, quantity: item.quantity + 1} 
            : item ) 
        : [...state, { ...product, quantity: 1 }];
      AsyncStorage.setItem('@goM:products', JSON.stringify(arrProducts));
      return arrProducts;
    });
  }, []);

  const increment = useCallback(async id => {
    setProducts(state => {
      const arrProducts = state.map(item => item.id === id ? {...item, quantity: item.quantity + 1 } : item)
      AsyncStorage.setItem('@goM:products', JSON.stringify(arrProducts));
      return arrProducts;
    });
  }, []);

  const decrement = useCallback(async id => {
    setProducts(state => {
      const arrProducts = state.map(item => item.id === id ? {...item, quantity: item.quantity - 1 } : item)
      AsyncStorage.setItem('@goM:products', JSON.stringify(arrProducts));
      return arrProducts;
    });
  }, []);

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
