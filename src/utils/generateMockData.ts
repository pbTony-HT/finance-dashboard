import type { Transaction } from '../types';

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split('T')[0];
}

export function generateMockTransactions(): Transaction[] {
  const now = new Date();
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, 1);
  const transactions: Transaction[] = [];

  const categories = ['Продукты', 'Транспорт', 'Развлечения', 'Здоровье', 'Жильё', 'Одежда', 'Другое'];

  // Добавим регулярные доходы
  for (let i = 0; i < 6; i++) {
    transactions.push({
      id: crypto.randomUUID(),
      amount: Math.round(50000 + Math.random() * 20000),
      type: 'income',
      category: 'Зарплата',
      date: randomDate(threeMonthsAgo, now),
      description: 'Ежемесячная зарплата',
    });
    transactions.push({
      id: crypto.randomUUID(),
      amount: Math.round(5000 + Math.random() * 10000),
      type: 'income',
      category: 'Фриланс',
      date: randomDate(threeMonthsAgo, now),
      description: 'Проектная работа',
    });
  }

  // Расходы (24 шт)
  for (let i = 0; i < 24; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    transactions.push({
      id: crypto.randomUUID(),
      amount: Math.round(500 + Math.random() * 8000),
      type: 'expense',
      category: cat,
      date: randomDate(threeMonthsAgo, now),
      description: cat === 'Продукты' ? 'Покупка продуктов' : undefined,
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date)); // сортировка от новых к старым
}