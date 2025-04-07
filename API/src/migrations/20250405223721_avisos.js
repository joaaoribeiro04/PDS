exports.up = function(knex) {
    return knex.schema.createTable('avisos', function(table) {
      table.increments('id').primary();
      table.integer('id_administrador').notNullable();
      table.integer('id_residente').notNullable();
      table.string('descricao').notNullable();
      table.date('data').notNullable();
  
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('avisos');
  };
  