import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Product, Transaction } from '../types';
import { analyzeSalesTrend } from '../services/geminiService';
import { TrendingUp, AlertTriangle, DollarSign, Package } from 'lucide-react';

interface DashboardProps {
  products: Product[];
  transactions: Transaction[];
}

export const Dashboard: React.FC<DashboardProps> = ({ products = [], transactions = [] }) => {
  const [aiInsight, setAiInsight] = useState<string>("Sedang menganalisis data penjualan...");

  // Safe data calculation
  const salesData = [
    { name: 'Senin', sales: 1200000 },
    { name: 'Selasa', sales: 2100000 },
    { name: 'Rabu', sales: 800000 },
    { name: 'Kamis', sales: 1600000 },
    { name: 'Jumat', sales: 2800000 },
    { name: 'Sabtu', sales: 4500000 },
    { name: 'Minggu', sales: 3800000 },
  ];

  const lowStockProducts = products.filter(p => p.stock <= p.minStockAlert);
  const totalValue = products.reduce((acc, curr) => acc + (curr.stock * curr.priceBuy), 0);
  const totalSales = transactions.reduce((acc, curr) => acc + curr.total, 0);

  useEffect(() => {
    let mounted = true;
    const fetchInsight = async () => {
      if (transactions.length > 0) {
        try {
          const insight = await analyzeSalesTrend(transactions);
          if (mounted) setAiInsight(insight);
        } catch (e) {
          if (mounted) setAiInsight("Gagal memuat analisis AI.");
        }
      } else {
        if (mounted) setAiInsight("Belum ada data transaksi yang cukup untuk analisis.");
      }
    };
    fetchInsight();
    return () => { mounted = false; };
  }, [transactions]);

  return (
    <div className="p-6 space-y-6 overflow-y-auto h-full pb-24">
      <h2 className="text-2xl font-bold text-ocean-900">Dashboard Toko</h2>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 text-ocean-600 mb-2">
            <DollarSign size={20} />
            <h3 className="font-semibold text-slate-500 text-sm">Total Penjualan</h3>
          </div>
          <p className="text-2xl font-bold">Rp {totalSales.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 text-ocean-600 mb-2">
            <Package size={20} />
            <h3 className="font-semibold text-slate-500 text-sm">Nilai Inventori</h3>
          </div>
          <p className="text-2xl font-bold">Rp {totalValue.toLocaleString('id-ID')}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 text-red-500 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-semibold text-slate-500 text-sm">Stok Menipis</h3>
          </div>
          <p className="text-2xl font-bold">{lowStockProducts.length} Item</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center space-x-3 text-purple-600 mb-2">
            <TrendingUp size={20} />
            <h3 className="font-semibold text-slate-500 text-sm">AI Insight</h3>
          </div>
          <p className="text-sm italic text-slate-600">{aiInsight}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[350px]">
          <h3 className="text-lg font-bold mb-4 text-ocean-900">Tren Penjualan Mingguan</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 12}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(value) => `${value / 1000000}jt`} 
                  tick={{fill: '#64748b', fontSize: 12}}
                />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Penjualan']}
                  contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 min-h-[350px] flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-red-600 flex items-center gap-2">
            <AlertTriangle size={20} /> Perlu Restock Segera
          </h3>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-3 rounded-tl-lg">Nama Produk</th>
                  <th className="p-3">Stok</th>
                  <th className="p-3 rounded-tr-lg">Min. Alert</th>
                </tr>
              </thead>
              <tbody>
                {lowStockProducts.length === 0 ? (
                  <tr><td colSpan={3} className="p-8 text-center text-slate-400">Semua stok aman terkendali.</td></tr>
                ) : (
                  lowStockProducts.slice(0, 5).map(p => (
                    <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50 transition">
                      <td className="p-3 font-medium text-slate-700">{p.name}</td>
                      <td className="p-3 text-red-600 font-bold">{p.stock} {p.unit}</td>
                      <td className="p-3 text-slate-500">{p.minStockAlert}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            {lowStockProducts.length > 5 && (
              <div className="text-center mt-3 text-xs text-slate-500">
                + {lowStockProducts.length - 5} produk lainnya
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};