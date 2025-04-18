module.exports = (app) => {
    const getAll = () => {
      return app.db("requests").select();
    };
  
    const getById = (filter = {}) => {
      return app.db("requests").where(filter).first();
    };
  
    const save = async (request) => {
      iconsole.log("Saving request:", request); // Adicione este log
      if (!request.id_residente) {
        return { error: "Residente não identificado.", status: 403 };
      }
      if (!request.description) {
        return { error: "Insert description", status: 400 };
      }
      if (!request.date) {
        return { error: "Insert date", status: 400 };
      }
  
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(request.date)) {
        return { error: "Invalid date format.", status: 400 };
      }
  
      try {
        return await app.db("requests").insert(request, "*");
      } catch (error) {
        console.error("failed to save request:", error); // Adicione este log
        throw error;
      }
    };
  
    const update = async (id, request) => {
      const existing = await getById({ id });
      if (!existing) return { error: "Request not found" };
  
      if (!request.description)
        return { error: "Insert description" };
      if (!request.date) return { error: "Insert date" };
  
      return app.db("requests").where({ id }).update(request, "*");

    };
  
    const remove = async (id) => {
      let requestDb = await getAll().where({ id });
      if (requestDb && requestDb.length == 0) return { error: "Utilizador não encontrado" };
  
      return app.db("requests").where({ id }).del();
    };
  
    return { getAll, getById, save, update, remove };
  };