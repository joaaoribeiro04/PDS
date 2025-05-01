/* eslint-disable no-undef */
const validationError = require("../errors/validationError");
const date = new Date();
const dateString = `${String(date.getDate()).padStart(2, "0")}/${String(
  date.getMonth() + 1
).padStart(2, "0")}/${date.getFullYear()}`;

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db("requests").where(filter).first();
  };

  const getAll = () => {
    return app.db("requests").select("*");
  };

  const save = async (request) => {
    request.date = dateString;
    request.status = "PENDING";

    if (!request.user_id)
      throw new validationError("User ID is a required attribute");
    if (!request.date)
      throw new validationError("Date is a required attribute");
    if (!request.status)
      throw new validationError("Status is a required attribute");
    if (!request.description)
      throw new validationError("Description is a required attribute");

    try {
      let [result] = await app
        .db("requests")
        .insert(request, [
          "id",
          "user_id",
          "description",
          "date",
          "status",
          "is_report",
        ]);

      return result;
    } catch (err) {
      throw new validationError("Error saving request", err.message);
    }
  };

  const update = async (id, request) => {
    let newRequest;

    if (!request)
      throw new validationError("Request cannot be updated with empty data");

    let requestDb = await getAll().where({ id }).first();
    if (requestDb && requestDb.length == 0)
      throw new validationError("Request not found");

    newRequest = { ...requestDb };
    newRequest.response = request.response;
    newRequest.admin_id = request.admin_id;

    switch (requestDb.is_report) {
      case true:
        newRequest.status = "CLOSED";
        newRequest.date = dateString;
        break;
      case false:
        if (request.accepted !== true && request.accepted !== false)
          throw new validationError(
            "Request cannot be updated without status change"
          );

        newRequest.date = dateString;
        
        request.accepted == true
          ? (newRequest.status = "APPROVED")
          : (newRequest.status = "DENIED");

        break;
      default:
        throw new validationError("Invalid type of request");
    }

    return app
      .db("requests")
      .where({ id })
      .update(newRequest, ["admin_id", "date", "status", "response"]);
  };

  return { findOne, getAll, save, update };
};
