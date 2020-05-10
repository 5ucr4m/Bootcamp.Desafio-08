import React from 'react';

import AppRoutes from './app.routes';
import { CartProvider } from '../hooks/cart';

const Routes: React.FC = () => {
  return (
    // <CartProvider>
      <AppRoutes />
    // {/* </CartProvider> */}
  );
};

export default Routes;
