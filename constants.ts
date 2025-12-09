import { Category, Product, UnitType } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Shimano Stella SW 4000',
    sku: 'SHM-STL-4000',
    category: Category.REEL,
    stock: 5,
    unit: UnitType.PCS,
    priceBuy: 8500000,
    priceSell: 10500000,
    minStockAlert: 2,
    description: 'Reel flagship untuk saltwater fishing, tahan korosi dan sangat kuat.'
  },
  {
    id: '2',
    name: 'Mustad Chinu No. 4',
    sku: 'MST-CHN-04',
    category: Category.KAIL,
    stock: 150,
    unit: UnitType.PACK,
    priceBuy: 15000,
    priceSell: 25000,
    minStockAlert: 20,
    description: 'Kail tajam standar kompetisi, cocok untuk ikan mas dan nila.'
  },
  {
    id: '3',
    name: 'Relix Nusantara Jabrik 15lb',
    sku: 'RLX-JBK-15',
    category: Category.SENAR,
    stock: 40,
    unit: UnitType.PCS,
    priceBuy: 80000,
    priceSell: 120000,
    minStockAlert: 10,
    description: 'Senar PE lokal kualitas premium, anti keriting dan kuat di node.'
  },
  {
    id: '4',
    name: 'Maguro Ottoman 180cm',
    sku: 'MGR-OTM-180',
    category: Category.JORAN,
    stock: 8,
    unit: UnitType.PCS,
    priceBuy: 450000,
    priceSell: 650000,
    minStockAlert: 3,
    description: 'Joran carbon hollow ringan, cocok untuk casting gabus.'
  }
];

export const INITIAL_TRANSACTIONS = [
  { id: 'TX-001', date: '2023-10-25', total: 120000, items: [] },
  { id: 'TX-002', date: '2023-10-26', total: 650000, items: [] },
  { id: 'TX-003', date: '2023-10-27', total: 2500000, items: [] },
  { id: 'TX-004', date: '2023-10-27', total: 150000, items: [] },
];
