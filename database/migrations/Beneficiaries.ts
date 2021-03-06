import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Beneficiaries extends BaseSchema {
  protected tableName = 'beneficiaries'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      
      table
      .integer('user_id')
      .unsigned()
       .references('id')
       .inTable('users')
       .onDelete('CASCADE')

      
       table.string('bankname').notNullable()
       table.integer('account_number').notNullable()
       table.integer('code').notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
