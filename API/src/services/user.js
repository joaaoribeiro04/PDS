/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = () => {
    return app.db("users").select();
  };

  const getById = (filter = {}) => {
    return app.db("users").where(filter).first();
  };

  const save = async (user) => {
    if (!user.name) return { error: "O nome é um atributo obrigatório" };
    if (!user.email) return { error: "O email é um atributo obrigatório" };
    if (!user.password)
      return { error: "A password é um atributo obrigatório" };
    if (!user.phone) return { error: "O telefone é um atributo obrigatório" };

    const userDb = await app.db("users").where({ email: user.email }).first();
    if (userDb) return { error: "Email duplicado" };

    try {
      const [newUser] = await app.db("users").insert(user, "*");

      await app.db("roles").insert({
        user_id: newUser.id,
        isAdmin: false,
        isWorker: false,
      });

      return newUser;
    } catch (err) {
      return { error: "Erro ao salvar usuário", details: err.message };
    }
  };

  const update = async (id, user) => {
    if (user) {
      let userDb = await getAll().where({ id });
      if (userDb && userDb.length == 0)
        return { error: "Utilizador não encontrado" };
    }

    if ((user.name && user.name == "") || user.name == null)
      return { error: "O nome é um atributo obrigatório" };
    if ((user.password && user.password == "") || user.password == null)
      return { error: "A password é um atributo obrigatório" };
    if ((user.phone && user.phone == "") || user.phone == null)
      return { error: "O telefone é um atributo obrigatório" };

    if (user.email) {
      let userDb = await getAll().where({ email: user.email });
      if (userDb && userDb.length > 0) return { error: "Email duplicado" };
    }

    if ((user.email && user.email == "") || user.email == null)
      return { error: "O email é um atributo obrigatório" };

    return app.db("users").where({ id }).update(user, "*");
  };

  const remove = async (id) => {
    let userDb = await getAll().where({ id });
    if (userDb && userDb.length == 0)
      return { error: "Utilizador não encontrado" };

    try {
      await app.db("roles").where({ user_id: id }).del();
      return await app.db("users").where({ id }).del();
    } catch (err) {
      return { error: "Error while removing user", details: err.message };
    }
  };

  return { getAll, getById, save, update, remove };
};
