/* eslint-disable no-undef */
const validationError = require("../errors/validationError");

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db("warnings").where(filter).first();
  };

  const getAll = () => {
    return app.db("warnings").select("*");
  };

  const save = async (warning) => {
    if (!warning.admin_id)
      throw new validationError("Admin ID is a required attribute");
    if (!warning.resident_id)
      throw new validationError("Resident ID is a required attribute");
    if (!warning.description)
      throw new validationError("Description is a required attribute");
    if (!warning.date)
      throw new validationError("Date is a required attribute");

    try {
      let [result] = await app
        .db("warnings")
        .insert(warning, [
          "id",
          "admin_id",
          "resident_id",
          "description",
          "date",
        ]);

      return result;
    } catch (err) {
      throw new validationError("Error saving warning", err.message);
    }
  };

  const update = async (id, warning) => {
    if (warning) {
      let warningDb = await getAll().where({ id });
      if (warningDb && warningDb.length == 0)
        throw new validationError("Warning not found");
    }

    if (
      (warning.description && warning.description == "") ||
      warning.description == null
    )
      throw new validationError("Warning description is a required attribute");

    if ((warning.date && warning.date == "") || warning.date == null)
      throw new validationError("Warning date is a required attribute");

    return app
      .db("warnings")
      .where({ id })
      .update(warning, ["description", "date"]);
  };

  const remove = async (id) => {
    let warningDb = await getAll().where({ id });
    if (warningDb && warningDb.length == 0)
      throw new validationError("Warning not found");

    try {
      return app.db("warnings").where({ id }).del();
    } catch (err) {
      throw new validationError("Error deleting warning", err.message);
    }
  };

  return { findOne, getAll, save, update, remove };
};
