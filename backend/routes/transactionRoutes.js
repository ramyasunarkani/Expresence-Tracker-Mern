const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../middleware/Auth');
const {
  addTransaction,
  getMyTransactions,
  updateTransaction,
  deleteTransaction
} = require('../controllers/transactionController');

router.post('/expenses/add', ensureAuthenticated, addTransaction);
router.get('/expenses', ensureAuthenticated, getMyTransactions);
router.put('/expenses/:id', ensureAuthenticated, updateTransaction);
router.delete('/expenses/:id', ensureAuthenticated, deleteTransaction);

module.exports = router;
