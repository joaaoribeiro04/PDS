const knex = require('../db/knex'); 

module.exports = {
  async getAll() {
    return knex('aviso').select('*');
  },

  async getById({ id }) {
    return knex('aviso').where({ id }).first();
  },

  async save(data) {
    try {
      const [id] = await knex('aviso').insert(data).returning('id');
      return this.getById({ id });
    } catch (error) {
      return { error: error.message };
    }
  },

  async update(id, data) {
    try {
      const updated = await knex('aviso').where({ id }).update(data).returning('*');
      return updated.length ? updated : { error: 'Aviso não encontrado ou não atualizado' };
    } catch (error) {
      return { error: error.message };
    }
  },

  async remove(id) {
    try {
      const deleted = await knex('aviso').where({ id }).del();
      return deleted ? { message: 'Aviso removido com sucesso' } : { error: 'Aviso não encontrado' };
    } catch (error) {
      return { error: error.message };
    }
  }
};
