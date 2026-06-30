import { useState, useMemo, useCallback } from 'react';
import type { Transaction, TransactionType } from './types';
import { loadTransactions, saveTransactions } from './utils/storage';
import SummaryCards from './components/SummaryCards';
import { ExpensePieChart, MonthlyLineChart, TopCategoriesBarChart } from './components/Charts';
import TransactionList from './components/TransactionList';
import TransactionFilters from './components/TransactionFilters';
import AddTransactionModal from './components/AddTransactionModal';
import { exportToCSV } from './utils/csvExport';

export default function App() {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [showModal, setShowModal] = useState(false);

  // Фильтры для списка
  const [filters, setFilters] = useState({
    type: 'all' as TransactionType | 'all',
    category: '',
    dateFrom: '',
    dateTo: '',
  });

  // Сохраняем изменения
  const updateTransactions = useCallback((newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    saveTransactions(newTransactions);
  }, []);

  const addTransaction = (data: { amount: number; type: TransactionType; category: string; date: string; description?: string }) => {
    const newTx: Transaction = {
      id: crypto.randomUUID(),
      ...data,
    };
    updateTransactions([newTx, ...transactions]);
  };

  const deleteTransaction = (id: string) => {
    updateTransactions(transactions.filter(t => t.id !== id));
  };

  // Фильтрованные транзакции для списка
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.category && t.category !== filters.category) return false;
      if (filters.dateFrom && t.date < filters.dateFrom) return false;
      if (filters.dateTo && t.date > filters.dateTo) return false;
      return true;
    });
  }, [transactions, filters]);

  // Текущий месяц для виджетов (можно сделать переключатель, но пока просто текущий)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Дашборд финансов</h1>
        <div className="flex gap-2 mt-2 md:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            + Добавить
          </button>
          <button
            onClick={() => exportToCSV(transactions)}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 transition"
          >
            Экспорт CSV
          </button>
        </div>
      </header>

      {/* Виджеты-счётчики за текущий месяц */}
      <SummaryCards transactions={transactions} month={currentMonth} year={currentYear} />

      {/* Графики */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <ExpensePieChart transactions={transactions} />
        <MonthlyLineChart transactions={transactions} />
        <TopCategoriesBarChart transactions={transactions} />
      </div>

      {/* Список транзакций с фильтрами */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-3">Транзакции</h2>
        <TransactionFilters filters={filters} onChange={setFilters} />
        <TransactionList transactions={filteredTransactions} onDelete={deleteTransaction} />
      </div>

      {/* Модальное окно */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSave={addTransaction}
        />
      )}
    </div>
  );
}