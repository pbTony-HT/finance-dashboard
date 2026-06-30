import type { Transaction } from '../types';

export function exportToCSV(transactions: Transaction[]) {
  const header = 'ID,Дата,Тип,Категория,Сумма,Описание';
  const rows = transactions.map(t =>
    `${t.id},${t.date},${t.type === 'income' ? 'Доход' : 'Расход'},${t.category},${t.amount},${t.description || ''}`
  );
  // Добавляем BOM для корректного отображения кириллицы в Excel
  const BOM = '\uFEFF';
  const csv = BOM + [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  link.click();
  URL.revokeObjectURL(url);
}