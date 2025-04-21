module.exports = (app) => {
    const getAll = () => {
      return app.db("gastos").select();
    };
  
    const getById = (filter = {}) => {
      return app.db("gastos").where(filter).first();
    };
  
    const gerarGastoAleatorio = () => {
      return {
        agua: Math.floor(Math.random() * 100) + 20,
        luz: Math.floor(Math.random() * 150) + 30,
        gas: Math.floor(Math.random() * 80) + 10,
        outros: Math.floor(Math.random() * 70),
        data: new Date().toISOString().split("T")[0],
      };
    };
  
    const saveRandom = async () => {
      const novoGasto = gerarGastoAleatorio();
      const [saved] = await app.db("gastos").insert(novoGasto, "*");
      return saved;
    };
  
    return { getAll, getById, saveRandom };
  };
  