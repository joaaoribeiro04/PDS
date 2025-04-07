module.exports = (db) => {
    const getAll = () => db('orders');
  
    const getById = (filter) => db('orders').where(filter).first();
  
    const save = async (order) => {
      const { product, quantity, client_name } = order;
      if (!product || !quantity || !client_name) {
        return { error: 'Campos obrigatórios em falta', status: 400 };
      }
  
      return db('orders').insert({ product, quantity, client_name }).returning('*');
    };
  
    const update = (id, order) => {
      return db('orders')
        .where({ id })
        .update(order)
        .returning('*');
    };
  
    const remove = (id) => db('orders').where({ id }).del();
  
    return { getAll, getById, save, update, remove };
  };
  