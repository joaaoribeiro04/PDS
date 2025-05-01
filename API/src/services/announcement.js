/* eslint-disable no-undef */
module.exports = (app) => {
  const getAll = () => {
    return app.db("announcements").select();
  };

  const getById = (filter = {}) => {
    return app.db("announcements").where(filter).first();
  };

  const save = async (announcement) => {
    console.log("A guardar o comunicado:", announcement); // Adicione este log
    if (!announcement.admin_id) {
      return { error: "Utilizador não autorizado.", status: 403 };
    }
    if (!announcement.description) {
      return { error: "A descrição é obrigatória", status: 400 };
    }
    if (!announcement.date) {
      return { error: "A data é obrigatória", status: 400 };
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(announcement.date)) {
      return { error: "Formato de data inválido.", status: 400 };
    }

    try {
      return await app.db("announcements").insert(announcement, "*");
    } catch (error) {
      console.error("Erro ao gravar o comunicado:", error); // Adicione este log
      throw error;
    }
  };

  const update = async (id, announcement) => {
    const existing = await getById({ id });
    if (!existing) return { error: "Comunicado não encontrado" };

    if (!announcement.description)
      return { error: "A descrição é obrigatória" };
    if (!announcement.date) return { error: "A data é obrigatória" };

    return app.db("announcements").where({ id }).update(announcement, "*");
  };

  const remove = async (id) => {
    const existing = await getById({ id });
    if (!existing) return { error: "Comunicado não encontrado" };

    return app.db("announcements").where({ id }).del();
  };

  return { getAll, getById, save, update, remove };
};
