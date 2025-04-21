exports.up = function(knex) {
    return knex.schema.createTable('faturas', function(table) {
      table.increments('id').primary(); 
      table.integer('id_residente').notNullable(); 
      table.integer('id_gastos').notNullable(); 
      table.integer('total').notNullable();
      table.date('data_emissao').notNullable();
      table.date('data_limite').notNullable();
      table.string('status', 25).notNullable();
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('faturas');
  };
  