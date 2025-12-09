import React, { useState } from 'react';
import { Product, CartItem, Transaction } from '../types';
import { ShoppingCart, Trash2, Plus, Minus, CreditCard } from 'lucide-react';

interface POSProps {
  products: Product[];
  onTransactionComplete: (items: CartItem[], total: number) => void;
}

export const POS: React.FC<POSProps> = ({ products, onTransactionComplete }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        // Simple stock check
        const product = products.find(p => p.id === id);
        if (product && newQty > product.stock) return item;
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.priceSell * item.quantity), 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    if (window.confirm(`Proses transaksi senilai Rp ${total.toLocaleString('id-ID')}?`)) {
      onTransactionComplete(cart, total);
      setCart([]);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-100 overflow-hidden">
      {/* Product Grid */}
      <div className="flex-1 flex flex-col p-4 md:p-6 overflow-hidden">
        <div className="mb-4">
          <input 
            type="text" 
            placeholder="Cari produk (Nama / SKU)..." 
            className="w-full p-3 rounded-xl border border-slate-300 shadow-sm focus:ring-2 focus:ring-ocean-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 overflow-y-auto pb-20">
          {filteredProducts.map(product => (
            <div 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-ocean-400 hover:shadow-md transition active:scale-95 flex flex-col justify-between"
            >
              <div>
                <h4 className="font-semibold text-slate-800 line-clamp-2">{product.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{product.category}</p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-ocean-700">Rp {product.priceSell.toLocaleString('id-ID')}</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600">{product.stock} {product.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <div className="w-full md:w-96 bg-white shadow-xl flex flex-col border-l border-slate-200 h-full">
        <div className="p-4 border-b bg-slate-50">
          <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
            <ShoppingCart size={20} /> Keranjang
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="text-center text-slate-400 mt-10">
              <p>Keranjang kosong</p>
              <p className="text-sm">Pilih produk di sebelah kiri</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                <div className="flex-1">
                  <h4 className="font-medium text-sm text-slate-800">{item.name}</h4>
                  <p className="text-xs text-ocean-600 font-semibold">
                    @ Rp {item.priceSell.toLocaleString('id-ID')} / {item.unit}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center border rounded-lg bg-slate-50">
                    <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded-l"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded-r"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t bg-slate-50 space-y-4">
          <div className="flex justify-between items-center text-xl font-bold text-slate-800">
            <span>Total</span>
            <span>Rp {total.toLocaleString('id-ID')}</span>
          </div>
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full bg-ocean-600 text-white py-3 rounded-xl font-bold hover:bg-ocean-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            <CreditCard size={20} /> Bayar Sekarang
          </button>
        </div>
      </div>
    </div>
  );
};