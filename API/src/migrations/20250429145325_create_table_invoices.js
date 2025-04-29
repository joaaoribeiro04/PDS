/* eslint-disable no-undef */
exports.up = function (knex) {
    return knex.schema.createTable("invoices", function (table) {
      table.increments("id").primary();
      table.integer("user_id").notNull().references("id").inTable("users");
      table.integer("expense_id").notNull().references("id").inTable("expenses");
      table.integer("total").notNull();
      table.date("issue_date").notNull();
      table.date("due_date").notNull();
      table.boolean("isPaid").defaultTo(false);
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("invoices");
  };
  