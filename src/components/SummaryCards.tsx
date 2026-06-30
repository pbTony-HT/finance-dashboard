import { useMemo } from 'react';
import type { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  month?: number; // 0-11, если нужен конкретный месяц
  year?: number;
}

export default function SummaryCards({ transactions, month, year }: Props) {
  const { income, expense, balance } = useMemo(() => {
    const filtered = transactions.filter(t => {
      if (month !== undefined && year !== undefined) {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      }
      return true;
    });

    const inc = filtered.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const exp = filtered.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    return { income: inc, expense: exp, balance: inc - exp };
  }, [transactions, month, year]);

  const currentMonth = month !== undefined
    ? new Date(year!, month).toLocaleString('ru', { month: 'long' })
    : 'за всё время';

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <h3 className="text-sm text-gray-500">Доходы {currentMonth}</h3>
        <p className="text-2xl font-bold text-green-600">{income.toLocaleString('ru')} ₽</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <h3 className="text-sm text-gray-500">Расходы {currentMonth}</h3>
        <p className="text-2xl font-bold text-red-600">{expense.toLocaleString('ru')} ₽</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <h3 className="text-sm text-gray-500">Баланс {currentMonth}</h3>
        <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
          {balance.toLocaleString('ru')} ₽
        </p>
      </div>
    </div>
  );
}