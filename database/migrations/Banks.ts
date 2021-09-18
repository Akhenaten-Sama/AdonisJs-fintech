import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Banks extends BaseSchema {
  protected tableName = 'banks'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()

      table.integer('user_id').unsigned().references('id').inTable('users')

      table.string('bankname').notNullable()
      table.integer('accountNumber').notNullable()
      table.integer('bankcode').notNullable()
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
