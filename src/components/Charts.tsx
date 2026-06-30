import { useMemo } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar
} from 'recharts';
import type { Transaction } from '../types';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF', '#FF66B2', '#6C757D'];

interface ChartsProps {
  transactions: Transaction[];
}

export function ExpensePieChart({ transactions }: ChartsProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totals: Record<string, number> = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Расходы по категориям</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" labelLine={false} outerRadius={80} dataKey="value">
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: any) => `${value.toLocaleString('ru')} ₽`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MonthlyLineChart({ transactions }: ChartsProps) {
  const data = useMemo(() => {
    const months: Record<string, { income: number; expense: number }> = {};
    transactions.forEach(t => {
      const monthKey = t.date.slice(0, 7); // YYYY-MM
      if (!months[monthKey]) months[monthKey] = { income: 0, expense: 0 };
      if (t.type === 'income') months[monthKey].income += t.amount;
      else months[monthKey].expense += t.amount;
    });

    const sortedMonths = Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, values]) => ({
        month: new Date(month + '-01').toLocaleString('ru', { month: 'short', year: '2-digit' }),
        income: values.income,
        expense: values.expense,
        balance: values.income - values.expense,
      }));

    // Добавляем накопленный баланс (кумулятивная сумма)
    let cumulativeBalance = 0;
    return sortedMonths.map(item => {
      cumulativeBalance += item.balance;
      return { ...item, cumulativeBalance };
    });
  }, [transactions]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Динамика по месяцам</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: any) => `${value.toLocaleString('ru')} ₽`} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#22c55e" name="Доходы" />
          <Line type="monotone" dataKey="expense" stroke="#ef4444" name="Расходы" />
          <Line type="monotone" dataKey="balance" stroke="#3b82f6" name="Баланс" />
          <Line type="monotone" dataKey="cumulativeBalance" stroke="#f97316" name="Накопления" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TopCategoriesBarChart({ transactions }: ChartsProps) {
  const data = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    const totals: Record<string, number> = {};
    expenses.forEach(t => {
      totals[t.category] = (totals[t.category] || 0) + t.amount;
    });
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [transactions]);
  // Внутри TopCategoriesBarChart, перед return, добавь:
    const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const { name, value } = payload[0].payload;
        return (
        <div className="bg-white border p-2 rounded shadow text-sm">
            <p className="font-medium">{name}</p>
            <p>{value.toLocaleString('ru')} ₽</p>
        </div>
        );
    }
    return null;
    };
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">Топ-5 категорий расходов</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}