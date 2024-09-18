const Expense = require("../model/expenseModel");

const expenseController = {
  //-----------------------------------------------Create A new Expense---------------------------------
  createExpense: async (req, res) => {
    try {
      const { item_name, quantity, price, restaurantId } = req.body;
      const expense = new Expense({ item_name, quantity, price, restaurantId });
      await expense.save();
      res.status(201).json(expense);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //-------------------------------------------Get All The Expenses-------------------------------

  listExpenses: async (req, res) => {
    try {
      const expenses = await Expense.find({restaurantId: req.query.restaurantId});

      if (!expenses) {
        return res.status(404).json({ message: "Expenses not found" });
      }
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  //-----------------------------------------------------------------------Update a Addons------------------------------------------
  updateExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const { item_name, price, quantity } = req.body;
      let expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      expense.item_name = item_name || expense.item_name;
      expense.price = price || expense.price;
      expense.quantity = quantity || expense.quantity;

      await expense.save();

      res.json(expense);
    } catch (error) {
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  // -------------------------------------------------- Delete a addon ------------------------------------------------

  deleteExpense: async (req, res) => {
    try {
      const { id } = req.params;
      const expense = await Expense.findById(id);

      if (!expense) {
        return res.status(404).json({ message: "Expense not found" });
      }

      await expense.deleteOne();

      res.json({ message: "Expense deleted successfully" });
    } catch (error) {
      console.error("Error deleting Expense:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

module.exports = expenseController;
