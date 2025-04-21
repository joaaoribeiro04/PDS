/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("order_history", (table) => {
    table.increments("id").primary();
    table.integer("order_id").notNullable().references("id").inTable("orders");
    table.string("status").notNullable();
    table.timestamp("changed_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("order_history");
};
