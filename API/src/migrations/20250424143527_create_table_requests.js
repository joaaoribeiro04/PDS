/* eslint-disable no-undef */

exports.up = function(knex) {
    return knex.schema.createTable("requests", (table) => {
        table.increments("id").primary();
        table.integer('user_id').notNull().references('id').inTable('users');
        table.integer('admin_id').references('id').inTable('users');
        table.string("description", 255).notNull();
        table.date('date').notNull();
        table.string("status", 15).notNull();
        table.string("response", 255);
        table.boolean("is_report").defaultTo(false);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable("requests");
};
