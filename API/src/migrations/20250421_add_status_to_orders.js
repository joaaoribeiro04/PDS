exports.up = function (knex) {
  return knex.schema.table("orders", (table) => {
    table.string("status").notNullable().defaultTo("pendente");
  });
};

exports.down = function (knex) {
  return knex.schema.table("orders", (table) => {
    table.dropColumn("status");
  });
};
