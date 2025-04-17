module.exports = (app) => {
    const getAll = () => {
      return app.db("reports").select();
    };
  
    const getById = (filter = {}) => {
      return app.db("reports").where(filter).first();
    };
  
    const save = async (report) => {
      iconsole.log("Saving report:", report); // Adicione este log
      if (!report.id_residente) {
        return { error: "Unidentifed resident.", status: 403 };
      }
      if (!report.description) {
        return { error: "Insert description", status: 400 };
      }
      if (!report.date) {
        return { error: "Insert date", status: 400 };
      }
  
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(request.date)) {
        return { error: "Invalid date format.", status: 400 };
      }
  
      try {
        return await app.db("reports").insert(report, "*");
      } catch (error) {
        console.error("failed to save report:", error); // Adicione este log
        throw error;
      }
    };
  
    const update = async (id, report) => {
      const existing = await getById({ id });
      if (!existing) return { error: "report not found" };
  
      if (!report.description)
        return { error: "Insert description" };
      if (!report.date) return { error: "Insert date" };
  
      return app.db("reports").where({ id }).update(report, "*");

    };
  
    const remove = async (id) => {
      let reporttDb = await getAll().where({ id });
      if (reportDb && reportDb.length == 0) return { error: "report not found" };
  
      return app.db("reports").where({ id }).del();
    };
  
    return { getAll, getById, save, update, remove };
  };