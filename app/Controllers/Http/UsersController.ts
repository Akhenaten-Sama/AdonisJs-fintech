import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { WithdrawtoBank, fundAccount, sendBalance, verify } from '../Utilities/utils'

export default class UsersController {


  public async show({ auth, response, params }: HttpContextContract) {
    
    await auth.use('api').authenticate()
    response.status(200)
    const user = await User.find(params.id)

    // const response0bj = {
    //   name: user?.name,
    //   email: user?.email,
    // }
        const userObj = (auth.use('api').user!)
    return {
       user: userObj
    }
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const user = await User.create(body)

    response.status(201)

    return user
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()

    const user = await User.findByOrFail('id', params.id)

    user.name = body.name
    user.email = body.email

    return user.save()
  }

  public async fund({ auth, request }: HttpContextContract) {
    const body = request.body()
    const {amount } = body
    const user = (auth.use('api').user!)

    const responseObj = fundAccount(user, amount)

    return responseObj
  }

  public async withdraw({auth,  request }: HttpContextContract) {
    const body = request.body()
    const { amount } = body

    const user = (auth.use('api').user!)

    const response0bj = WithdrawtoBank(amount, user)

    return response0bj
  }

  public async transfer({auth, request}:HttpContextContract){
    const body = request.body()
    const user = (auth.use('api').user!)
    const { email, amount } = body

    const response0bj = sendBalance(amount, user, email )
       return response0bj
  }

  public async verify({auth, request}:HttpContextContract){
    const body = request.body()
    const {Id, Amount} = body
    
    if (request.host() ==='localhost:3000'){
      return {
        message:"unathorized"
      }
    }
      
    const responseObj = verify(Id, Amount)

    return responseObj
  }

}