import { DateTime } from 'luxon'
import { BaseModel, column, BelongsTo, belongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'


export default class Bank extends BaseModel {
    @column({ isPrimary: true })
    public id: number
 
    @column()
    public bankname: string

    @column()
    public user_id: string


    @column()
    public accountNumber:Number

    @column()
    public bankcode:Number

    @belongsTo(() => User)
    public user: BelongsTo<typeof User>


    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

}