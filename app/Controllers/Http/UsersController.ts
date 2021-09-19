import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { WithdrawtoBank, fundAccount, sendBalance, verify, addAccount } from '../Utilities/utils'

export default class UsersController {


  public async show({ auth, response, }: HttpContextContract) {
    
    await auth.use('api').authenticate()
    response.status(200)
   // const user = await User.find(params.id)

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

    const response0bj = await WithdrawtoBank(amount, user)
   console.log(response0bj)
    return response0bj
  }

  public async transfer({auth, request}:HttpContextContract){
    const body = request.body()
    const user = (auth.use('api').user!)
    const { email, amount } = body

    const response0bj = sendBalance(amount, user, email )
       return response0bj
  }

  public async verify({request}:HttpContextContract){
    const body = request.body()
    const {Id, Amount} = body
    
    if (request.host() ==='localhost:3000'){
      return {
        message:"unathorized access"
      }
    }
      
    const responseObj = verify(Id, Amount)

    return responseObj
  }


  public async addBank({request, auth}: HttpContextContract){


    try {
      const user = (auth.use('api').user!)
 const {code, accountNumber, bankname} = request.body()

 
 const details = {
   code,
   accountNumber,
   bankname
 }
    const response0bj = addAccount(user.id, details, "bank")
       return response0bj
  
    } catch (error) {
      return {
        message:"invalid credentials, request failed!"
      }
    }
    
}


public async addBeneficiary({request, auth}: HttpContextContract){


  try {
    const user = (auth.use('api').user!)
const {code, accountNumber, bankname} = request.body()


const details = {
 code,
 accountNumber,
 bankname
}
  const response0bj = addAccount(user.id, details, "beneficiary")
     return response0bj

  } catch (error) {
    return {
      message:"invalid credentials, request failed!"
    }
  }
  
}
}

