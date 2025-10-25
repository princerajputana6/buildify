import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'react-hot-toast'],
          'http-vendor': ['axios'],
          
          // Feature chunks
          'product-pages': [
            './src/pages/Products.jsx',
            './src/pages/ProductDetails.jsx'
          ],
          'cart-checkout': [
            './src/pages/Cart.jsx',
            './src/pages/Checkout.jsx'
          ],
          'order-pages': [
            './src/pages/Orders.jsx',
            './src/pages/OrderSuccess.jsx',
            './src/pages/OrderTracking.jsx'
          ],
          'user-pages': [
            './src/pages/Profile.jsx',
            './src/pages/Wishlist.jsx',
            './src/pages/OTPLogin.jsx'
          ]
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
