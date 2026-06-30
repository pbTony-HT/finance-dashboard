export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string; // YYYY-MM-DD
  description?: string;
}

export const EXPENSE_CATEGORIES = [
  'Продукты', 'Транспорт', 'Развлечения', 'Здоровье', 'Жильё', 'Одежда', 'Другое'
] as const;

export const INCOME_CATEGORIES = [
  'Зарплата', 'Фриланс', 'Подарок', 'Инвестиции', 'Другое'
] as const;