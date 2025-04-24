/* eslint-disable no-undef */

exports.up = function (knex) {
  return knex.schema.createTable("orders", (table) => {
    table.increments("id").primary();
    table.integer('user_id').notNull().references('id').inTable('users');
    table.integer('worker_id').references('id').inTable('users');
    table.date('date').notNull();
    table.string("status", 25).notNull();
});
};

exports.down = function (knex) {
  return knex.schema.dropTable("orders");
};
