import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import AddExpenseForm from '../components/AddExpenseForm';
import AllExpensesList from '../components/AllExpensesList';
import './Home.css';

function Home() {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedInUser(localStorage.getItem('loggedInUser'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setTimeout(() => navigate('/login'), 1000);
  };

  const fetchExpenses = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/expenses", {
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (Array.isArray(data)) setExpenses(data);
      else handleError(data.message || 'Failed to fetch transactions');
    } catch (err) {
      handleError('Something went wrong');
    }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/expenses/${id}`, {
        method: "DELETE",
        headers: { 'Authorization': localStorage.getItem('token') }
      });
      const data = await response.json();
      if (data.success) {
        handleSuccess('Deleted successfully!');
        fetchExpenses();
      } else {
        handleError(data.message || 'Failed to delete');
      }
    } catch (err) {
      handleError('Something went wrong');
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  return (
    <div className="home">
      <div className="home-header">
        <div className="user-info">
          <h2>Welcome, <span>{loggedInUser}</span></h2>
        </div>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="home-subheader">
        <button onClick={() => { setEditingExpense(null); setShowForm(true); }}>
          Add New Expense
        </button>
        <button onClick={() => navigate('/expenses/charts')}>View Charts</button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <AddExpenseForm
              existingExpense={editingExpense}
              onAdded={() => {
                fetchExpenses();
                setShowForm(false);
                setEditingExpense(null);
              }}
              onClose={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <AllExpensesList
        expenses={expenses}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />

      <ToastContainer />
    </div>
  );
}

export default Home;
