import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Account extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public balance: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>



  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
