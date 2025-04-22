/* eslint-disable no-undef */
const validationError = require("../errors/validationError");
const bcrypt = require("bcrypt-nodejs");

module.exports = (app) => {
  const findOne = (filter = {}) => {
    return app.db("users").where(filter).first();
  };

  getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const getAll = () => {
    return app.db("users").select("id", "name", "email", "phone");
  };

  const getById = (filter = {}) => {
    return app
      .db("users")
      .where(filter)
      .first()
      .select("id", "name", "email", "phone");
  };

  const save = async (user) => {
    if (!user.name)
      throw new validationError("Name is a required attribute");
    if (!user.email)
      throw new validationError("Email is a required attribute");
    if (!user.password)
      throw new validationError("Password is a required attribute");
    if (!user.phone)
      throw new validationError("Phone is a required attribute");

    const userDb = await findOne({ email: user.email });
    if (userDb) throw new validationError("Email is already in use");    

    try {
      let newUser = { ...user };
      newUser.password = getPasswordHash(user.password);

      let [resultUser] = await app
        .db("users")
        .insert(newUser, ["id", "name", "email", "phone"]);

      await app.db("roles").insert({
        user_id: resultUser.id,
        isAdmin: false,
        isWorker: false,
      });

      return resultUser;
    } catch (err) {
      throw new validationError("Error saving user", err.message);
    }
  };

  const update = async (id, user) => {
    if (user) {
      let userDb = await getAll().where({ id });
      if (userDb && userDb.length == 0)
        throw new validationError("User not found");
    }

    if ((user.name && user.name == "") || user.name == null)
      throw new validationError("Name is a required attribute");
    if ((user.password && user.password == "") || user.password == null)
      throw new validationError("Password is a required attribute");
    if ((user.phone && user.phone == "") || user.phone == null)
      throw new validationError("Phone is a required attribute");

    if (user.email) {
      let userDb = await getAll().where({ email: user.email });
      if (userDb && userDb.length > 0)
        throw new validationError("Email is already in use");
    }

    if ((user.email && user.email == "") || user.email == null)
      throw new validationError("Email is a required attribute");

    let newUser = { ...user };
    if (user.password) newUser.password = getPasswordHash(user.password);
    
    return app.db("users").where({ id }).update(newUser, ["id", "name", "email", "phone"]);
  };

  // #FIXME - There is a problem where it catches an error most of the time (catch route)
  const remove = async (id) => {
    let userDb = await getAll().where({ id });
    if (userDb && userDb.length == 0)
      throw new validationError("User not found");

    try {
      await app.db("roles").where({ user_id: id }).del();
      return await app.db("users").where({ id }).del('Warning deleted');
    } catch (err) {
      throw new validationError("Error while removing user", err.message);
    }
  };

  return { findOne, getAll, getById, save, update, remove };
};
