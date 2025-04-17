/* eslint-disable no-undef */

exports.up = function(knex) {
    return knex.schema.createTable('warnings', (table) => {
        table.increments('id').primary();
        table.integer('admin_id').notNull().references('id').inTable('users');
        table.integer('resident_id').notNull().references('id').inTable('users');
        table.string('description').notNull();
        table.date('date').notNull();
    
      });
};

exports.down = function(knex) {
    return knex.schema.dropTable('warnings');
};
