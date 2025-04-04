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

    let userDb = await getAll().where({ email: user.email });
    if (userDb && userDb.length > 0) return { error: "Email duplicado" };

    return app.db("users").insert(user, "*");
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
    if (userDb && userDb.length == 0) return { error: "Utilizador não encontrado" };

    return app.db("users").where({ id }).del();
  };

  return { getAll, getById, save, update, remove };
};
