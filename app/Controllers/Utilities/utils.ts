import User from '../../Models/User'
import Bank from 'App/Models/Bank'
import axios from 'axios'
import Database from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'
import { withDrawData, data } from './data'







// transfers from one account to another
export const sendBalance = async (amount, user, emailto) => {
  const From = user
  const To = await User.findBy('email', emailto)

  //prevent crediting self
  if(!To||From.email === To?.email){
    return {message:"You caanot send funds to yourself"}
  }

  try {
     //if you balance is less than amount
  if (From.balance < amount) {
    return {
      message: 'insufficient balance',
    }

    //when all bottlenecks have been escaped from
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


//handles bank and beneficiary withdrawals
export const WithdrawtoBank = async (amount, user) => {
  const bank = await Bank.findByOrFail('user_id', user.id)
  let responseData 
  try {

    //post the transfer via flutterwave
    const JsonResponse = await axios({
      headers: { Authorization: `Bearer ${Env.get('MYSECRETKEY')}`},
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
      error: error.message 
      
    }
  }
}


//handles funding of account
export const fundAccount = async (user, amount) => {
  
  try {

    //post the funds via flutterwave
    const JsonResponse = await axios({
      headers: { Authorization:`Bearer ${Env.get('MYSECRETKEY')}` },
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

//handles adding of withdrawal accounts
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

//verifies the transaction and credits or debits the account based on transaction type.
export const verify = async(user_id, amount, type)=>{
  const user = await User.find(user_id)
  
  try {
    if (type ==="credit" && user){
      
        user.balance = (user?.balance) + parseInt(amount)
        user.save()

        return {
          message:'account funded'
        }
      
    }else if (type ==="debit" && user){
      user.balance = (user?.balance) - parseInt(amount)
      user.save()
     return{
       message:"account debited"
     }
    }
    
 

  } catch (error) {
   return{ message:"unable to fund account"}
  }
  


 
}