export enum UnitType {
  PCS = 'Pcs',
  BOX = 'Box',
  PACK = 'Pack',
  SET = 'Set',
  KG = 'Kg'
}

export enum Category {
  JORAN = 'Joran (Rod)',
  REEL = 'Reel',
  KAIL = 'Kail (Hooks)',
  SENAR = 'Senar (Line)',
  UMPAN = 'Umpan (Bait)',
  AKSESORIS = 'Aksesoris'
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: Category;
  stock: number;
  unit: UnitType;
  priceBuy: number;
  priceSell: number;
  description?: string;
  minStockAlert: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
}

export interface SalesStat {
  name: string;
  sales: number;
}