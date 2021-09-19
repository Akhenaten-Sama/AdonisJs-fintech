/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import Url from 'url-parse'
const CLEARDB_DATABASE_URL = new Url(Env.get('CLEARDB_DATABASE_URL'))

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql
    |
    */
    mysql: {
      client: 'mysql',
      connection: {
        host: Env.get('MYSQL_HOST')||CLEARDB_DATABASE_URL.host as string,
        port: Env.get('MYSQL_PORT') || Number(''),
        user: Env.get('MYSQL_USER')||CLEARDB_DATABASE_URL.username as string,
        password: Env.get('MYSQL_PASSWORD', '')||CLEARDB_DATABASE_URL.password as string,
        database: Env.get('MYSQL_DB_NAME')||CLEARDB_DATABASE_URL.pathname.substr(1) as string,
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },

  }
}

export default databaseConfig
