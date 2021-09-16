import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import User from '../../app/Models/User'
export default class UserSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await User.createMany([
      {
        name:'Oluwaseun',
        email: 'virk@adonisjs.com',
        password: 'secret',
      },
      {
        name:'Olalekan',
        email: 'romain@adonisjs.com',
        password: 'supersecret'
      }
    ])
  }
}
