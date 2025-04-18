/* eslint-disable no-undef */
const validationError = require("../errors/validationError");

module.exports = (app) => {
  const getAll = () => {
    return app.db("users").select();
  };

  const getById = (filter = {}) => {
    return app.db("users").where(filter).first();
  };

  const save = async (user) => {
    if (!user.name)
      throw new validationError("O nome é um atributo obrigatório");
    if (!user.email)
      throw new validationError("O email é um atributo obrigatório");
    if (!user.password)
      throw new validationError("A password é um atributo obrigatório");
    if (!user.phone)
      throw new validationError("O telefone é um atributo obrigatório");

    const userDb = await app.db("users").where({ email: user.email }).first();
    if (userDb) throw new validationError("Email duplicado");

    try {
      const [newUser] = await app.db("users").insert(user, "*");

      await app.db("roles").insert({
        user_id: newUser.id,
        isAdmin: false,
        isWorker: false,
      });

      return newUser;
    } catch (err) {
      throw new validationError("Erro ao salvar usuário", err.message);
    }
  };

  const update = async (id, user) => {
    if (user) {
      let userDb = await getAll().where({ id });
      if (userDb && userDb.length == 0)
        throw new validationError("Utilizador não encontrado");
    }

    if ((user.name && user.name == "") || user.name == null)
      throw new validationError("O nome é um atributo obrigatório");
    if ((user.password && user.password == "") || user.password == null)
      throw new validationError("A password é um atributo obrigatório");
    if ((user.phone && user.phone == "") || user.phone == null)
      throw new validationError("O telefone é um atributo obrigatório");

    if (user.email) {
      let userDb = await getAll().where({ email: user.email });
      if (userDb && userDb.length > 0)
        throw new validationError("Email duplicado");
    }

    if ((user.email && user.email == "") || user.email == null)
      throw new validationError("O email é um atributo obrigatório");

    return app.db("users").where({ id }).update(user, "*");
  };

  const remove = async (id) => {
    let userDb = await getAll().where({ id });
    if (userDb && userDb.length == 0)
      throw new validationError("Utilizador não encontrado");

    try {
      await app.db("roles").where({ user_id: id }).del();
      return await app.db("users").where({ id }).del();
    } catch (err) {
      throw new validationError("Error while removing user", err.message);
    }
  };

  return { getAll, getById, save, update, remove };
};
