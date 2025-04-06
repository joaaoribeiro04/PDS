/* eslint-disable no-undef */

exports.up = (knex) => {
  return knex.schema.createTable("announcements", (table) => {
    table.increments("id").primary(); // Alterado para auto-incrementar
    table.integer("id_administrator").notNullable();
    table.string("description", 255).notNullable();
    table.string("image", 255);
    table.date("date").notNullable();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable("announcements");
};
