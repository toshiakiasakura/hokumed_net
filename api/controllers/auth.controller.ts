/**
 * User authentication and register user are defined here.
 */
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { getManager } from 'typeorm'
import moment from 'moment'
import sha1 from 'sha1'

import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { User } from '../entity/user.entity'
import { Class_Year } from '../entity/study.entity'
import { ExpressFunc } from '../helpers/express_typing'
import { EmailSender } from '../helpers/email.helper'


class AuthController {
  static login: ExpressFunc = async function (req, res){
    let userRepository = getManager().getRepository(User)
    let user = await userRepository.findOne({where: {email:req.body.email}})
    console.log('Login process started.')
    if ( user === undefined ){
      res.json({status:401, msg:'Login failure. ユーザーが見つかりませんでした.'}) // User not found and password fail is different
    } else if( user.activation_status =='pending'){
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

  /**
   * User sign up function.
   */
  static signup: ExpressFunc = async function (req, res){
    let userRepository = getManager().getRepository(User)

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
      let user = new User()
      user.email = body.email
      const [ salt, crypted_password ] = newBCryptPassword(body.password)
      user.salt = salt
      user.crypted_password = crypted_password
      user.family_name = body.family_name
      user.given_name = body.given_name
      user.handle_name = body.handle_name
      user.birthday = body.birth_day
      user.email_mobile = body.email_mobile
      user.class_year = body.class_year
      user.created_at = new Date()
      const activationToken = sha1(moment().format('DD-MMM-YYY HH:mm:ss'))
      user.activation_token= activationToken
      await userRepository.save(user)

      EmailSender.signupVerificationMail(
        user.email,
        user.family_name,
        user.given_name,
        user.id,
        activationToken
      )
      res.json({status:200, msg:"認証メールを送信しました．\nメールのリンクをクリックするまで登録は完了しません．"})
      console.log('新規登録しました．認証メールが送信されています．(not implemented yet)')
    }
  }

  /**
   * onBlur duplication check for email.
   */
  static checkEmail: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
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

  /**
   * onBlur duplication check for handle name.
   * If request user is same as handle name, pass.
   */
  static checkHandle: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    let handle_user = await userRepository
      .findOne({where:{handle_name: req.body.handle}})
    let userID = parseInt(req.cookies.userID)
    if (handle_user){
      let reqUser = await userRepository.findOne(userID)
      if(reqUser && reqUser.id === handle_user.id){
        res.json({ status:200, })
      } else {
        res.json({
          status:401,
          msg:'そのハンドルネームは既に用いられています．'
        })
      }
    } else {
      res.json({ status:200, })
    }
  }

  /**
   * E-mail verification. This function is accessed from email.
   */
  static verifyEmail: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    let user = await userRepository.findOne(req.params.userID)
    if (user && user.activation_token === req.params.token){
      user.activation_status = 'active'
      await userRepository.save(user)
      // NOTE: This redirect correctly leads to react-app is unbiguous.
      res.redirect('/verify/email-success')
    } else {
      res.redirect('/verify/email-failure')
    }
  }

  /**
   * Resetpassword process. This function generates token.
   */
  static resetPassword: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    let user = await userRepository.findOne({where: {email:req.body.email}})
    console.log('reset password process started.')
    if( user ){
      const [ salt, crypted_password ] = newBCryptPassword(req.body.password)
      user.new_salt = salt
      user.new_crypted_password = crypted_password
      const password_token= sha1(moment().format('DD-MMM-YYY HH:mm:ss'))
      user.password_token = password_token
      await userRepository.save(user)

      EmailSender.resetPasswordVerificationMail(user.email, user.id, password_token)
      res.send({status:200})

    } else {
      res.json({status:204})
    }
  }

  /**
   * This function is accessed via email, and actually change the password.
   */
  static verifyResetPassword: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    let user = await userRepository.findOne(req.params.userID)
    if (user && user.password_token === req.params.token){
      user.salt = user.new_salt
      user.crypted_password = user.new_crypted_password
      await userRepository.save(user)
      res.redirect('/verify/reset-success')
    } else {
      res.redirect('/verify/reset-failure')
    }
  }

  /**
   * This method is intended to be used routinely, for example, every 3:00 am.
   * Delete accounts which activationStatus is false, so that
   * keep database clean.
   */
  static cleanup: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(User)
    let users = await userRepository.find({activation_status:'pending'})
    for(let user of users){
      await userRepository.remove(user)
    }
  }

  static ClassYearBoard: ExpressFunc = async function(req,res){
      let yearRepo = getManager().getRepository(Class_Year)
      const years = await yearRepo.find()
      res.json({contents:years, status:200})

  }

}

export { AuthController }