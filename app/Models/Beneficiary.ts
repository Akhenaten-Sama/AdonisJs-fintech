import { DateTime } from 'luxon'
import { BaseModel, column, } from '@ioc:Adonis/Lucid/Orm'

export default class Beneficiary extends BaseModel {
    @column({ isPrimary: true })
    public id: number
 
    @column()
    public user_id: string  
    
    @column()
    public bankname: string

    @column()
    public code: Number

    @column()
    public accountNumber:Number

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime



}