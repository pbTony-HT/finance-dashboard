import { useMemo } from 'react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TransactionType } from '../types';

interface Filters {
  type: TransactionType | 'all';
  category: string;
  dateFrom: string;
  dateTo: string;
}

interface Props {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export default function TransactionFilters({ filters, onChange }: Props) {
  // Уникальный список всех категорий (без дубликатов)
  const allCategories = useMemo(
    () => [...new Set([...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES])],
    []
  );

  const categories =
    filters.type === 'income'
      ? INCOME_CATEGORIES
      : filters.type === 'expense'
        ? EXPENSE_CATEGORIES
        : allCategories;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <select
        value={filters.type}
        onChange={e =>
          onChange({ ...filters, type: e.target.value as TransactionType | 'all', category: '' })
        }
        className="border rounded px-2 py-1 text-sm bg-white"
      >
        <option value="all">Все типы</option>
        <option value="income">Доходы</option>
        <option value="expense">Расходы</option>
      </select>
      <select
        value={filters.category}
        onChange={e => onChange({ ...filters, category: e.target.value })}
        className="border rounded px-2 py-1 text-sm bg-white"
      >
        <option value="">Все категории</option>
        {categories.map(cat => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <input
        type="date"
        value={filters.dateFrom}
        onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
        className="border rounded px-2 py-1 text-sm bg-white"
        placeholder="С даты"
      />
      <input
        type="date"
        value={filters.dateTo}
        onChange={e => onChange({ ...filters, dateTo: e.target.value })}
        className="border rounded px-2 py-1 text-sm bg-white"
        placeholder="По дату"
      />
    </div>
  );
}