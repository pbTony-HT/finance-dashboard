import type { Transaction } from '../types';
import { generateMockTransactions } from './generateMockData';

const STORAGE_KEY = 'finance-dashboard-transactions';

export function loadTransactions(): Transaction[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // если данные повреждены
    }
  }
  // первый запуск – генерируем фейки
  const mock = generateMockTransactions();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mock));
  return mock;
}

export function saveTransactions(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}