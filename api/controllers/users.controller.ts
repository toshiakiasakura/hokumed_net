/* User authentication and register user are defined here.
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import path from 'path'
import { getManager } from 'typeorm'
import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { Users } from '../entity/Users'
import { ExpressFunc } from '../helpers/express_typing'
import { signupVerificationMail } from '../helpers/email.helper'
import moment from 'moment'
import sha1 from 'sha1'

class UserController{

  static login: ExpressFunc = async function (req, res){
    let userRepository = getManager().getRepository(Users)
    let user = await userRepository.findOne({where: {email:req.body.email}})
    console.log('Login process started.')
    if ( user === undefined ){
      res.json({status:401, msg:'Login failure. ユーザーが見つかりませんでした.'}) // User not found and password fail is different
    } else if( !user.activation_status ){
      res.json({status:401, msg:'Login failure. メール認証が出来ていません.'}) // User not found and password fail is different
    } else if(
      bcrypt.compareSync(req.body.password + user.salt, user.crypted_password)
    ){
      /** Here, create accessToken.
       */
      const token = jwt.sign({id: user.id, email: user.email},
                              req.app.get("secretKey"),
                              {expiresIn:3600}  )
      res.json({status:200,
                msg:'ログインに成功しました.',
                accessToken:token,
                email:req.body.email,
                userID:user.id,
                admin: user.admin
              })
      user.access_token = token
      await userRepository.save(user)
    } else {
      res.json({status:401, msg:'Login failure. パスワードが正しくありません.'})
    }
  }

  static signup: ExpressFunc = async function (req, res){
    let userRepository = getManager().getRepository(Users)

    let email_users= await userRepository.find({email: req.body.email})
    let handle_users = await userRepository.find({handle_name: req.body.handle_name})
    if ( email_users.length ){
      res.json({
        status:401,
        msg:'新規登録に失敗しました. そのemailは既に用いられています．'
      })
      console.log(email_users)
      console.log('signup fail.')
    } else if( handle_users.length ){
      res.json({
        status:401,
        msg:'新規登録に失敗しました. そのハンドルネームは既に用いられています．'
      })
    } else {
      const body = req.body
      let user = new Users()
      user.email = body.email
      const [ salt, crypted_password ] = newBCryptPassword(body.password)
      user.salt = salt
      user.crypted_password = crypted_password
      user.family_name = body.family_name
      user.given_name = body.given_name
      user.handle_name = body.handle_name
      user.birthday = body.birth_day
      user.email_mobile = body.email_mobile
      user.class_year_id = body.class_year_id
      user.created_at = new Date()
      const activationToken = sha1(moment().format('DD-MMM-YYY HH:mm:ss'))
      user.activation_token= activationToken
      await userRepository.save(user)

      signupVerificationMail(
        user.email,
        user.family_name,
        user.given_name,
        user.id,
        activationToken
      )
      res.json({status:200, msg:"successfully signup."})
      console.log('新規登録しました．認証メールが送信されています．(not implemented yet)')
    }
  }

  /** onBlur duplication check for email.
   */
  static checkEmail: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    let email_users = await userRepository.find({email: req.body.email})
    if (email_users.length ){
      res.json({
        status:401,
        msg:'そのメールアドレスは既に用いられています．'
      })
    } else {
      res.json({
        status:200,
      })
    }
  }

  /** onBlur duplication check for handle name.
   */
  static checkHandle: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    let handle_users = await userRepository.find({handle_name: req.body.handle})
    if (handle_users.length ){
      res.json({
        status:401,
        msg:'そのハンドルネームは既に用いられています．'
      })
    } else {
      res.json({
        status:200,
      })
    }
  }

  static verifyEmail: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    let user = await userRepository.findOne(req.params.userID)
    if (user && user.activation_token === req.params.token){
      user.activation_status = true
      await userRepository.save(user)
      res.redirect('/verify-success')
    } else {
      res.redirect('/verify-failure')
    }
  }
  /**
   * Used for displaying personal account information
   * in individual profile page.
   */
  static ProfileBoard: ExpressFunc = async function (req, res){
    let userRepository = getManager().getRepository(Users)
    const userID = req.headers['x-user-id']
    let user = null
    console.log(userID, user, typeof userID, typeof user)
    if (typeof userID === 'string'){
      user = await userRepository.findOne(parseInt(userID))
    }

    if(user){
      console.log("GET profile succeeded")
      res.json({user:user, status:200})
    } else{
      console.log('GET profile failed. ', user)
      res.json({status:401})
    }
  }

  /**
   * This method is intended to be used routinely, for example, every 3:00 am.
   * Delete accounts which activationStatus is false, so that
   * keep database clean.
   */
  static cleanup: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    let users = await userRepository.find({activation_status:false})
    for(let user of users){
      await userRepository.remove(user)
    }
  }
}

export { UserController }
