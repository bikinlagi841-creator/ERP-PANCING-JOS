import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { Inventory } from './components/Inventory';
import { POS } from './components/POS';
import { Product, Transaction, CartItem } from './types';
import { MOCK_PRODUCTS, INITIAL_TRANSACTIONS } from './constants';
import { LayoutDashboard, Package, ShoppingCart, Fish } from 'lucide-react';

// Use a simple union type for routing
type View = 'dashboard' | 'inventory' | 'pos';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);

  // Handlers
  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const handleTransactionComplete = (items: CartItem[], total: number) => {
    // 1. Create Transaction Record
    const newTx: Transaction = {
      id: `TX-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      total: total,
      items: items
    };
    setTransactions(prev => [...prev, newTx]);

    // 2. Reduce Stock
    setProducts(prev => prev.map(p => {
      const itemInCart = items.find(i => i.id === p.id);
      if (itemInCart) {
        return { ...p, stock: p.stock - itemInCart.quantity };
      }
      return p;
    }));

    // 3. Switch to Dashboard to see results (optional UX choice)
    alert("Transaksi Berhasil!");
    setCurrentView('dashboard');
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-ocean-900 text-white flex flex-col shadow-xl z-20">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-ocean-800">
          <Fish className="text-ocean-100" size={32} />
          <h1 className="hidden lg:block ml-3 font-bold text-xl tracking-tight">Fisherman ERP</h1>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-2">
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === 'dashboard' ? 'bg-ocean-600 shadow-lg' : 'hover:bg-ocean-800 text-ocean-100'}`}
          >
            <LayoutDashboard size={24} />
            <span className="hidden lg:block ml-3 font-medium">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setCurrentView('inventory')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === 'inventory' ? 'bg-ocean-600 shadow-lg' : 'hover:bg-ocean-800 text-ocean-100'}`}
          >
            <Package size={24} />
            <span className="hidden lg:block ml-3 font-medium">Stok Barang</span>
          </button>

          <button 
            onClick={() => setCurrentView('pos')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${currentView === 'pos' ? 'bg-ocean-600 shadow-lg' : 'hover:bg-ocean-800 text-ocean-100'}`}
          >
            <ShoppingCart size={24} />
            <span className="hidden lg:block ml-3 font-medium">Kasir (POS)</span>
          </button>
        </nav>

        <div className="p-4 border-t border-ocean-800">
           <div className="hidden lg:block text-xs text-ocean-300">
             <p>v1.0.0 Stable</p>
             <p className="mt-1">Powered by Gemini</p>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden relative">
        {currentView === 'dashboard' && <Dashboard products={products} transactions={transactions} />}
        {currentView === 'inventory' && <Inventory products={products} onAddProduct={handleAddProduct} onUpdateProduct={handleUpdateProduct} />}
        {currentView === 'pos' && <POS products={products} onTransactionComplete={handleTransactionComplete} />}
      </main>
    </div>
  );
};

export default App;