import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, type TransactionType } from '../types';

const schema = z.object({
  amount: z
    .string()
    .min(1, 'Укажите сумму')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Введите положительное число'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Выберите категорию'),
  date: z.string().min(1, 'Укажите дату'),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onClose: () => void;
  onSave: (data: { amount: number; type: TransactionType; category: string; date: string; description?: string }) => void;
}

export default function AddTransactionModal({ onClose, onSave }: Props) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      category: '',
      description: '',
      amount: '',
    },
  });

  const selectedType = watch('type') as TransactionType;
  const categories = selectedType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const onSubmit = (data: FormData) => {
    onSave({
      ...data,
      amount: Number(data.amount),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Новая транзакция</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Тип</label>
            <select {...register('type')} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="income">Доход</option>
              <option value="expense">Расход</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Категория</label>
            <select {...register('category')} className="mt-1 block w-full border rounded px-3 py-2">
              <option value="">Выберите...</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Сумма (₽)</label>
            <input type="number" step="1" {...register('amount')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Дата</label>
            <input type="date" {...register('date')} className="mt-1 block w-full border rounded px-3 py-2" />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <input type="text" {...register('description')} className="mt-1 block w-full border rounded px-3 py-2" placeholder="Необязательно" />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Отмена</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Добавить</button>
          </div>
        </form>
      </div>
    </div>
  );
}