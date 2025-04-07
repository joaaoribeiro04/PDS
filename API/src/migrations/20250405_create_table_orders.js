exports.up = function(knex) {
    return knex.schema.createTable('orders', table => {
      table.increments('id').primary();
      table.string('client_name').notNullable();
      table.string('address').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('orders');
  };