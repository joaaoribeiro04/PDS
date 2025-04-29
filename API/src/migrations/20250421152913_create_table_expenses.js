/* eslint-disable no-undef */
exports.up = function(knex) {
    return knex.schema.createTable('expenses', function(table) {
      table.increments('id').primary();
      table.integer('water').notNull();
      table.integer('energy').notNull();
      table.integer('gas').notNull();
      table.integer('others').notNull();
      table.date('date').notNull();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('expenses');
  };
  