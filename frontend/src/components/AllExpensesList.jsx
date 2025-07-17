import React, { useState } from 'react';
import './AllExpensesList.css';

function AllExpensesList({ expenses, onDelete, onEdit }) {
  const [filterType, setFilterType] = useState('all'); // 'all', 'income', 'expense'

  const filteredExpenses = filterType === 'all'
    ? expenses
    : expenses.filter(item => item.type === filterType);

  return (
    <div className="all-expenses">
      <div className="expenses-header">
        <h3>All Expenses</h3>
        <div className="filter-buttons">
          <button
            className={filterType === 'all' ? 'active' : ''}
            onClick={() => setFilterType('all')}
          >All</button>
          <button
            className={filterType === 'income' ? 'active' : ''}
            onClick={() => setFilterType('income')}
          >Income</button>
          <button
            className={filterType === 'expense' ? 'active' : ''}
            onClick={() => setFilterType('expense')}
          >Expense</button>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <p className="no-expenses">No expenses found</p>
      ) : (
        filteredExpenses.map(item => (
          <div key={item._id} className="expense-card">
            <div className="expense-info">
              <div><strong>Category:</strong> {item.category}</div>
              <div><strong>Amount:</strong> ₹{item.amount}</div>
              <div><strong>Type:</strong> {item.type}</div>
              <div><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</div>
            </div>
            <div className="expense-actions">
              <button className="edit-btn" onClick={() => onEdit(item)}>Edit</button>
              <button className="delete-btn" onClick={() => onDelete(item._id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AllExpensesList;
