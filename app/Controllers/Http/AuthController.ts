import User from "App/Models/User";
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
public async index({}:HttpContextContract){
 return{
   message:"Fintech Api 1.0.",
   Author:"Efunkunle Olalekan",
   Extra:"I hope I get the job"
 }
}
  //registers new users
  public async register({auth, request }: HttpContextContract) {
    /**
     * Validate user details
     */
    const validationSchema = schema.create({
      name: schema.string({trim:true}),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: "users", column: "email" }),
      ]),
      password: schema.string({ trim: true }),
    });
    const userDetails = await request.validate({
      schema: validationSchema,
    });
    /**
     * Create a new user
     */
    const user = await User.create(userDetails);
    await auth.use('api').login(user)
   return user
  }
//logs the user in
  public async login({ auth, response, request }: HttpContextContract, ) {

    const body = request.body()
    const user = await User.findBy('email', body.email)

//verifies password
    if (!(await Hash.verify(user? user.password: '', body.password))) {
      return response.badRequest('Invalid credentials')
    }else{
      
    const token = await auth.use('api').attempt(body.email, body.password, {
       expiresIn: "7days",
     })
   //response.status(200).send('successful login')
   return {
     name:user?.name,
     balance: user?.balance,
     email: user?.email,
     token:token.toJSON()}
  //  return response.redirect().toRoute('UsersController.show', { id: user?.id })
}
  
 
  }
}