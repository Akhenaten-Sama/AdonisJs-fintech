export const data = (amount, email, userid, name)=>{
    return{
    "tx_ref":`fintech ${email}+${userid}+${amount}`,
    "amount":amount,
    "currency":"NGN",
    "redirect_url":"https://webhook.site/9d0b00ba-9a69-44fa-a43d-a82c33c36fdc",
    "payment_options":"card",
    "meta":{
       "customer_id":userid,
    },
    "customer":{
       "email":email,
       "name":name,
       "userid":userid
    },
    "customizations":{
        "title":"Olalekan Adonis App",
        "description":"Fund Your Account!",
        "logo":"https://static.wikia.nocookie.net/fire-brigade-of-flames/images/1/15/Benimaru_Shinmon.png/"
     }
   
 }
}


export const withDrawData = (amount, bankCode, accountNo )=>{

   return{
      "account_bank": bankCode,
      "account_number": accountNo,
      "amount": amount,
      "narration": "Transfer From Olalekan's fintech app",
      "currency": "NGN",
      "reference": "akhlm-pstmnpyt-rfxx007_PMCKDU_1",
      "callback_url": "https://webhook.site/b3e505b0-fe02-430e-a538-22bbbce8ce0d",
      "debit_currency": "NGN"
   }
   
}

