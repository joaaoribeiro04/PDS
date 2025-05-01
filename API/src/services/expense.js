/* eslint-disable no-undef */
const validationError = require("../errors/validationError");
const date = new Date();
const dateString = `${String(date.getDate()).padStart(2, "0")}/${String(
  date.getMonth() + 1
).padStart(2, "0")}/${date.getFullYear()}`;

module.exports = (app) => {
  const getAll = () => {
    return app.db("expenses").select();
  };

  const findOne = (filter = {}) => {
    return app.db("expenses").where(filter).first();
  };

  const generateRandomExpenses = () => {
    return {
      water: Math.floor(Math.random() * 100) + 20,
      energy: Math.floor(Math.random() * 150) + 30,
      gas: Math.floor(Math.random() * 80) + 10,
      others: Math.floor(Math.random() * 70),
    };
  };

  const save = async (expense) => {
    expense.date = dateString;

    if (!expense.water)
      throw new validationError("Water is a required attribute");

    if (!expense.energy)
      throw new validationError("Energy is a required attribute");

    if (!expense.gas) throw new validationError("Gas is a required attribute");

    if (!expense.others)
      throw new validationError("Others is a required attribute");

    if (!expense.date)
      throw new validationError("Date is a required attribute");

    try {
      let [result] = await app
        .db("expenses")
        .insert(expense, ["id", "water", "energy", "gas", "others", "date"]);

      return result;
    } catch (err) {
      throw new validationError("Error saving expense", err.message);
    }
  };

  return { getAll, findOne, save, generateRandomExpenses };
};
