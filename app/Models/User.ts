import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column,  hasMany, HasMany, beforeSave, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'
import Beneficiary from './Beneficiary'
import Bank from './Bank'


export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public email: string

  @column()
  public balance: number
  @hasMany(() => Beneficiary)
  public beneficiary: HasMany<typeof Beneficiary>

  @hasOne(() => Bank)
  public bank: HasOne<typeof Bank>

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
}

}
