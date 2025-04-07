module.exports = (app) => {
    const getAll = () => {
      return app.db("faturas").select();
    };
  
    const getById = (filter = {}) => {
      return app.db("faturas").where(filter).first();
    };
  
    const save = async (fatura) => {
      if (!fatura.id_residente) {
        return { error: "Residente não identificado.", status: 403 };
      }
      if (!fatura.total) {
        return { error: "O total é obrigatório", status: 400 };
      }
      if (!fatura.data_emissao || !/^\d{4}-\d{2}-\d{2}$/.test(fatura.data_emissao)) {
        return { error: "Data de emissão inválida ou ausente", status: 400 };
      }
      if (!fatura.data_limite || !/^\d{4}-\d{2}-\d{2}$/.test(fatura.data_limite)) {
        return { error: "Data limite inválida ou ausente", status: 400 };
      }
      return app.db("faturas").insert(fatura, "*");
    };
  
    const update = async (id, fatura) => {
      const existing = await getById({ id });
      if (!existing) return { error: "Fatura não encontrada" };
  
      if (!fatura.total) return { error: "O total é obrigatório" };
      if (!fatura.data_emissao) return { error: "A data de emissão é obrigatória" };
  
      return app.db("faturas").where({ id }).update(fatura, "*");
    };
  
    const remove = async (id) => {
      const existing = await getById({ id });
      if (!existing) return { error: "Fatura não encontrada" };
      return app.db("faturas").where({ id }).del();
    };
  
    return { getAll, getById, save, update, remove };
  };