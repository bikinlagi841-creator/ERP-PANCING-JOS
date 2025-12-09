import React, { useState } from 'react';
import { Product, Category, UnitType } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Search, Plus, Sparkles, Save, X, Edit2 } from 'lucide-react';

interface InventoryProps {
  products: Product[];
  onAddProduct: (p: Product) => void;
  onUpdateProduct: (p: Product) => void;
}

export const Inventory: React.FC<InventoryProps> = ({ products, onAddProduct, onUpdateProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    category: Category.AKSESORIS,
    unit: UnitType.PCS,
    description: ''
  });

  const handleOpenModal = () => {
    setFormData({
      category: Category.AKSESORIS,
      unit: UnitType.PCS,
      description: '',
      stock: 0,
      minStockAlert: 5,
      priceBuy: 0,
      priceSell: 0
    });
    setIsModalOpen(true);
  };

  const handleGenerateDesc = async () => {
    if (!formData.name || !formData.category) return;
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.priceSell) return;

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      sku: formData.sku || `SKU-${Date.now()}`,
      category: formData.category as Category,
      unit: formData.unit as UnitType,
      stock: Number(formData.stock),
      priceBuy: Number(formData.priceBuy),
      priceSell: Number(formData.priceSell),
      minStockAlert: Number(formData.minStockAlert),
      description: formData.description
    };

    onAddProduct(newProduct);
    setIsModalOpen(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-ocean-900">Manajemen Stok</h2>
        <button 
          onClick={handleOpenModal}
          className="bg-ocean-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-ocean-700 transition"
        >
          <Plus size={18} /> Tambah Produk
        </button>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-3 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari berdasarkan nama atau SKU..." 
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-ocean-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="p-4 font-semibold text-slate-600 border-b">Produk</th>
              <th className="p-4 font-semibold text-slate-600 border-b">Kategori</th>
              <th className="p-4 font-semibold text-slate-600 border-b">Stok</th>
              <th className="p-4 font-semibold text-slate-600 border-b">Harga Beli</th>
              <th className="p-4 font-semibold text-slate-600 border-b">Harga Jual</th>
              <th className="p-4 font-semibold text-slate-600 border-b">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="hover:bg-slate-50 border-b last:border-0">
                <td className="p-4">
                  <div className="font-medium text-slate-900">{product.name}</div>
                  <div className="text-xs text-slate-500">{product.sku}</div>
                </td>
                <td className="p-4 text-slate-600">
                  <span className="bg-slate-100 px-2 py-1 rounded text-xs">{product.category}</span>
                </td>
                <td className="p-4">
                  <span className={`${product.stock <= product.minStockAlert ? 'text-red-600 font-bold' : 'text-slate-700'}`}>
                    {product.stock} {product.unit}
                  </span>
                </td>
                <td className="p-4 text-slate-600">Rp {product.priceBuy.toLocaleString('id-ID')}</td>
                <td className="p-4 text-ocean-700 font-medium">Rp {product.priceSell.toLocaleString('id-ID')}</td>
                <td className="p-4">
                  <button className="text-slate-400 hover:text-ocean-600"><Edit2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Tambah Produk Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Produk</label>
                  <input 
                    required
                    type="text" 
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none"
                    value={formData.name || ''}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">SKU / Barcode</label>
                  <input 
                    type="text" 
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-ocean-500 outline-none"
                    value={formData.sku || ''}
                    onChange={e => setFormData({...formData, sku: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kategori</label>
                  <select 
                    className="w-full border rounded-lg p-2 outline-none"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value as Category})}
                  >
                    {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Satuan</label>
                  <select 
                    className="w-full border rounded-lg p-2 outline-none"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value as UnitType})}
                  >
                    {Object.values(UnitType).map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Beli</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2 outline-none"
                    value={formData.priceBuy || ''}
                    onChange={e => setFormData({...formData, priceBuy: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Harga Jual</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2 outline-none"
                    value={formData.priceSell || ''}
                    onChange={e => setFormData({...formData, priceSell: Number(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stok Awal</label>
                  <input 
                    type="number" 
                    className="w-full border rounded-lg p-2 outline-none"
                    value={formData.stock || ''}
                    onChange={e => setFormData({...formData, stock: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi & Info Mancing</label>
                <div className="flex gap-2 mb-2">
                  <textarea 
                    className="w-full border rounded-lg p-2 outline-none h-24 text-sm"
                    value={formData.description || ''}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Contoh: Cocok untuk Galatama Lele..."
                  ></textarea>
                </div>
                <button 
                  type="button"
                  onClick={handleGenerateDesc}
                  disabled={!formData.name || isGenerating}
                  className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 disabled:opacity-50"
                >
                  <Sparkles size={14} /> {isGenerating ? 'Gemini sedang berpikir...' : 'Generate Deskripsi dengan AI'}
                </button>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 flex items-center gap-2"
                >
                  <Save size={18} /> Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};