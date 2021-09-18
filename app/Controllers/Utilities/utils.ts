import User from '../../Models/User'
import Bank from 'App/Models/Bank'
import axios from 'axios'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import { withDrawData, data } from './data'

export const sendBalance = async (amount, user, emailto) => {
  const From = user
  const To = await User.findBy('email', emailto)


  


  if(!To||From.email === To?.email){
    return {message:"Destination account does not exist"}
  }

  try {
     
  if (From.balance < amount) {
    return {
      message: 'insufficient balance',
    }
  } else if (From && To) {
    From.balance = From.balance - amount
    To.balance = To.balance + amount
 From.save()
 To.save()
    return {
         message:"transfer successful"
    }
  }


} catch (error) {
  return {
    message:"Unable to process transfer"
}
}


}



export const WithdrawtoBank = async (amount, user) => {
  const bank = await Bank.findByOrFail('user_id', user.id)
  let responseData 
  try {
    const JsonResponse = await axios({
      headers: { Authorization: `Bearer ${Env.get('MYSECRETKEY')}` },
      method: 'post',
      url: 'https://api.flutterwave.com/v3/transfers',
      data: withDrawData(amount, bank.bankcode, bank.accountNumber),
    })
 responseData = await JsonResponse
   console.log(responseData)
      return {
        message: 'Withdrawal successful',
       data: responseData
    }
  } catch (error) {
    return {
      message: 'unable to process withdrawal, please try again later',
      error: responseData 
      
    }
  }
}



export const fundAccount = async (user, amount) => {
  
  try {
    const JsonResponse = await axios({
      headers: { Authorization: `Bearer ${Env.get('MYSECRETKEY')}` },
      method: 'post',
      url: 'https://api.flutterwave.com/v3/payments',
      data: data(amount, user.email, user.id, user.name),
    })
    const responsedata = await JsonResponse.data.data

    return {
      message: 'you can now pay via link below',
      link: responsedata.link,
    }
  } catch (error) {
    console.log(error)
    return {
      message: 'unable to process payment',
    }
  }
}


export const addAccount = async (user_id, details, filter:String) => {
     if(filter === 'bank'){
         await Database.transaction(async (trx) => {
               const user = await User.findOrFail(user_id, { client: trx });
     
               await user.related('bank').create({
                    bankname: details.bankname,
                    bankcode: details.code,
                    accountNumber: details.accountNumber
                  });
               })
       
               return {
                 message:"successfully added your bank"
               }
     
     }else if(filter === 'beneficiary'){
      await Database.transaction(async (trx) => {
        const user = await User.findOrFail(user_id, { client: trx });

        await user.related('beneficiary').create({
             bankname: details.bankname,
             code: details.code,
             accountNumber:details.accountNumber
           });
        })

        return {
          message:"successfully added a beneficiary"
        }

     }
}


export const verify = async(user_id, amount)=>{

  const user = await User.find(user_id)
  try {

    if( user){
      user.balance = (user?.balance) + parseInt(amount)
      user.save()
    }
 
 return {
   message:'account funded'
 }
  } catch (error) {
   return{ message:"unable to fund account"}
  }
  


 
}