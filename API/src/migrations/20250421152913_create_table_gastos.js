/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('gastos', function(table) {
      table.increments('id').primary();
      table.integer('agua').notNullable();
      table.integer('luz').notNullable();
      table.integer('gas').notNullable();
      table.integer('outros').notNullable();
      table.date('data').notNullable();
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('gastos');
  };
  