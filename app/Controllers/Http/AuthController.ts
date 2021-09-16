import User from "App/Models/User";
import Hash from '@ioc:Adonis/Core/Hash'
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class AuthController {
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
    const user = User.create(userDetails);
    await auth.use('api').login(user)
   return user
  }

  public async login({ auth, response, request }: HttpContextContract, ) {

    
    const body = request.body()
    const user = await User.findBy('email', body.email)


    if (!(await Hash.verify(user.password, body.password))) {
      return response.badRequest('Invalid credentials')
    }else{
      
    const token = await auth.use('api').attempt(body.email, body.password, {
       expiresIn: "7days",
     })
   //response.status(200).send('successful login')
   return token.toJSON()
  //  return response.redirect().toRoute('UsersController.show', { id: user?.id })
}
  
 
  }
}