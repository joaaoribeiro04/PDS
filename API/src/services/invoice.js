/* eslint-disable no-undef */
const validationError = require("../errors/validationError");
const date = new Date();
const futureDate = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000);

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db("invoices").where(filter).first();
  };

  const getAll = () => {
    return app.db("invoices").select("*");
  };

  const save = async (invoice) => {
    let expense = await app.services.expense.save(
      await app.services.expense.generateRandomExpenses()
    );

    invoice.expense_id = expense.id;
    invoice.total =
      expense.water + expense.energy + expense.gas + expense.others;

    invoice.issue_date = date.toLocaleDateString();
    invoice.due_date = futureDate.toLocaleDateString();

    if (!invoice.user_id)
      throw new validationError("User ID is a required attribute");

    if (!invoice.expense_id)
      throw new validationError("Expense ID is a required attribute");

    if (!invoice.total)
      throw new validationError("Total is a required attribute");

    if (!invoice.issue_date)
      throw new validationError("Issue date is a required attribute");

    if (!invoice.due_date)
      throw new validationError("Due date is a required attribute");

    try {
      let [result] = await app.db("invoices").insert(invoice, ["*"]);

      return result;
    } catch (err) {
      throw new validationError("Error saving invoice", err.message);
    }
  };

  const update = async (id, invoice) => {
    if (!invoice)
      throw new validationError("Invoice cannot be updated with empty data");

    let invoiceDb = await getAll().where({ id }).first();

    if (invoiceDb && invoiceDb.length == 0)
      throw new validationError("Invoice not found");

    return app.db("invoices").where({ id }).update(invoice, ["isPaid"]);
  };

  return { getAll, findOne, save, update };
};
