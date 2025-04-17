/* eslint-disable no-undef */

exports.up = (knex) => {
  return knex.schema.createTable("roles", (table) => {
    table.increments("id").primary();
    table.integer("user_id").notNull().references("id").inTable("users");
    table.boolean("isAdmin").notNull().defaultTo(false);
    table.boolean("isWorker").notNull().defaultTo(false);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("roles");
};
