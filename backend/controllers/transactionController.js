const Transaction = require('../models/Transaction');

addTransaction = async (req, res) => {
  try {
    const { amount, category, type, date } = req.body;
    const newTransaction = new Transaction({
      user: req.user.id,
      amount, category, type, date
    });
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to add transaction' });
  }
};

getMyTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to get transactions' });
  }
};

updateTransaction = async (req, res) => {
  try {
    const updated = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    res.json({ success: true, transaction: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to update transaction' });
  }
};

deleteTransaction = async (req, res) => {
  try {
    await Transaction.deleteOne({ _id: req.params.id, user: req.user.id });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to delete transaction' });
  }
};

module.exports = { addTransaction, getMyTransactions, updateTransaction, deleteTransaction };
