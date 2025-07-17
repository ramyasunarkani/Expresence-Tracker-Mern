import React, { useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { handleError, handleSuccess } from '../utils';
import './AddExpenseForm.css';

function AddExpenseForm({ existingExpense, onAdded, onClose }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    date: '',
    type: 'expense'
  });

  useEffect(() => {
    if (existingExpense) {
      setFormData({
        amount: existingExpense.amount,
        category: existingExpense.category,
        date: existingExpense.date ? existingExpense.date.substring(0, 10) : '',
        type: existingExpense.type
      });
    }
  }, [existingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = existingExpense
        ? `http://localhost:4000/api/expenses/${existingExpense._id}`
        : "http://localhost:4000/api/expenses/add";
      const method = existingExpense ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify(formData)
      });
      const result = await response.json();
      if (result.success || result._id) {
        handleSuccess(existingExpense ? 'Transaction updated!' : 'Transaction added!');
        setFormData({ amount: '', category: '', date: '', type: 'expense' });
        onAdded();
      } else {
        handleError(result.message || 'Failed to save transaction');
      }
    } catch (err) {
      handleError('Something went wrong');
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h3>{existingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
        <button className="close-icon" onClick={onClose}>
          <FiX size={20} />
        </button>
      </div>
      <form className="expense-form" onSubmit={handleSubmit}>
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <button type="submit" className="submit-btn">
          {existingExpense ? 'Update' : 'Add'}
        </button>
      </form>
    </div>
  );
}

export default AddExpenseForm;
