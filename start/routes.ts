/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'


Route.group(()=>{
  Route.get('/', 'AuthController.index')
  Route.post('/register', 'AuthController.register')
  Route.post('/login', 'AuthController.login')

  

  Route.post('logout', async ({ auth,  }) => {
  await auth.use('api').revoke()
  return {
    revoked: true
  }
})

Route.group(()=>{
  Route.resource('users', 'UsersController').apiOnly()
  Route.post('users/fund', 'UsersController.fund')
  Route.post('users/withdraw', 'UsersController.withdraw')
  Route.post('users/transfer', 'UsersController.transfer')
  Route.post('users/verify', 'UsersController.verify')
  Route.post('users/addbank', 'UsersController.addBank')
  Route.post('users/addbeneficiary', 'UsersController.addBeneficiary')

 
  
}).middleware("auth")

})





