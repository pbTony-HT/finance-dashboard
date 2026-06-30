import type { Transaction } from '../types';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export default function TransactionList({ transactions, onDelete }: Props) {
  if (transactions.length === 0) {
    return <p className="text-gray-500 text-center py-4">Нет транзакций</p>;
  }

  return (
    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
      {transactions.map(t => (
        <div key={t.id} className="flex items-center justify-between p-3 bg-white rounded shadow-sm border border-gray-100">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="font-medium text-sm truncate">{t.category}</span>
              <span className="text-xs text-gray-400">{t.date}</span>
            </div>
            {t.description && <p className="text-xs text-gray-500 ml-4 mt-1 truncate">{t.description}</p>}
          </div>
          <div className="flex items-center gap-2 ml-2">
            <span className={`font-semibold text-sm ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('ru')} ₽
            </span>
            <button
              onClick={() => onDelete(t.id)}
              className="text-gray-400 hover:text-red-500 transition p-1"
              title="Удалить"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}