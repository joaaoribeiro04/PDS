module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'postgres',      
        password: 'jp2003',     
        database: 'pds',       
        port: 5432             
      },
      migrations: {
        directory: './src/migrations'
      },
      pool: {
        min: 0,
        max: 50,
        propagateCreateError: false,
      }
    }
  };
  