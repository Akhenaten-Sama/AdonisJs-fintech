import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { WithdrawtoBank, fundAccount, sendBalance, verify, addAccount } from '../Utilities/utils'

export default class UsersController {

//returns currently logged in user
  public async show({ auth, response, }: HttpContextContract) {
    try {
      await auth.use('api').authenticate()
      response.status(200)
          const userObj = (auth.use('api').user!)
      return {
         user: userObj
      }
    } catch (error) {
      return{
        message:"An error occured"
      }
    }
   
  }

  

  

//updates basic user details
  public async update({ params, request }: HttpContextContract) {

    try {
      const body = request.body()
      const user = await User.findByOrFail('id', params.id)
  
      user.name = body.name
      user.email = body.email
  
       user.save()
       return user
    } catch (error) {
      return {
        message:"There was an error editing your details",
        error:error.message
      }
    }
   
  }

//delete user account
  public async destroy({auth, response}:HttpContextContract){
    try {
      const user = (auth.use('api').user!)
      user.delete()

      return {
        message:"Account deleted"
      }
    } catch (error) {
      response.status(503)
      return {
        error:"unable to delete user"
      }
    }
   
  }

  //funds the user account
  public async fund({ auth,response, request }: HttpContextContract) {
    try {
      const body = request.body()
    const {amount } = body
    const user = (auth.use('api').user!)

    const responseObj = fundAccount(user, amount)

    return responseObj
      
    } catch (error) {
      response.status(400)
      return{
        error:error.message
      }
    }
    
  }


  //withdraws to bank 
  public async withdraw({auth, response,  request }: HttpContextContract) {
    try {
      const body = request.body()
    const { amount } = body

    const user = (auth.use('api').user!)

    const response0bj = await WithdrawtoBank(amount, user)
   console.log(response0bj)
    return response0bj
    } catch (error) {
     response.status(400)
      return{
        error
      }
    }
    
  }


  //Transfers funds to fellow users, request are confiremd by the Zapier webhook
  public async transfer({auth, response, request}:HttpContextContract){
    try {
      const body = request.body()
    const user = (auth.use('api').user!)
    const { email, amount } = body

    const response0bj = sendBalance(amount, user, email )
       return response0bj
    } catch (error) {
      response.status(503)
      return{
        error
      }
    }
    
  }


  //communicates with the Zapier webhook, and credits the account after verification.
  public async verify({request}:HttpContextContract){
    try {
      const body = request.body()
      const {Id, Amount, type} = body
      
      if (request.host() ==='localhost:3000' || ''){
        return {
          message:"unathorized access"
        }
      }
        
      const responseObj = verify(Id, Amount, type)
      return responseObj
    } catch (error) {
      return {
        error
      }
    }
   
  }

//adds user bank for withdrawal
  public async addBank({request, response, auth}: HttpContextContract){
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
      response.status(400)
      return {
        message:"invalid credentials, request failed!"
      }
    }
    
}

//adds beneficiaries for users
public async addBeneficiary({request, response, auth}: HttpContextContract){

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
    response.status(400)
    return {
      message:"invalid credentials, request failed!"
    }
  }
  
}
}

