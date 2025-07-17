import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { handleError } from '../utils';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ChartsPage.css';

function ChartsPage() {
  const [transactions, setTransactions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const navigate = useNavigate();

  useEffect(() => { fetchTransactions(); }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/expenses", {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (Array.isArray(data)) setTransactions(data);
      else handleError(data.message || 'Failed to fetch');
    } catch (err) {
      handleError('Something went wrong');
    }
  };

  // Filter by month & year
  const filtered = transactions.filter(tx => {
    const date = new Date(tx.date);
    return (date.getMonth() + 1) === Number(selectedMonth) && date.getFullYear() === Number(selectedYear);
  });

  const totalIncome = filtered.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = filtered.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);
  const balance = totalIncome - totalExpense;

  // Group expenses by category
  const expenseGroups = filtered.filter(tx => tx.type === 'expense').reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  const expensePieData = Object.entries(expenseGroups).map(([name, value]) => ({ name, value }));

  // Group income by category
  const incomeGroups = filtered.filter(tx => tx.type === 'income').reduce((acc, tx) => {
    acc[tx.category] = (acc[tx.category] || 0) + tx.amount;
    return acc;
  }, {});
  const incomePieData = Object.entries(incomeGroups).map(([name, value]) => ({ name, value }));

  const COLORS = ['#0088FE', '#FFBB28', '#FF8042', '#00C49F', '#AA336A', '#9933FF'];

  return (
    <div className="charts-page">
      {/* Header */}
      <div className="charts-header">
      <button className="back-btn" onClick={() => navigate('/home')}>
        <FaArrowLeft />
      </button>
      <h2>Monthly Financial Summary</h2>
    </div>


      {/* Filter */}
      <div className="filters-summary-container">
  <div className="filter-controls">
    <div className="filter-item">
      <label>Year</label>
      <input 
        type="number" 
        value={selectedYear} 
        onChange={e => setSelectedYear(e.target.value)} 
      />
    </div>
    <div className="filter-item">
      <label>Month</label>
      <input 
        type="number" 
        min="1" 
        max="12" 
        value={selectedMonth} 
        onChange={e => setSelectedMonth(e.target.value)} 
      />
    </div>
  </div>

  <div className="summary">
    <div className="summary-item income">
      <p>Total Income</p>
      <span>₹{totalIncome}</span>
    </div>
    <div className="summary-item expense">
      <p>Total Expense</p>
      <span>₹{totalExpense}</span>
    </div>
    <div className="summary-item balance">
      <p>Balance</p>
      <span>₹{balance}</span>
    </div>
  </div>
</div>


      {/* Side-by-side pie charts */}
      <div className="charts-row">
        <div className="chart-box">
          <h3>Expenses by Category</h3>
          {expensePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={expensePieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {expensePieData.map((entry, index) => (
                    <Cell key={`exp-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p>No expenses this month</p>}
        </div>

        <div className="chart-box">
          <h3>Income by Category</h3>
          {incomePieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={incomePieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {incomePieData.map((entry, index) => (
                    <Cell key={`inc-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : <p>No income this month</p>}
        </div>
      </div>

      {/* Bar chart below */}
      <div className="chart-box">
        <h3>Income vs Expense</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { name: 'Income', value: totalIncome },
            { name: 'Expense', value: totalExpense }
          ]}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default ChartsPage;
