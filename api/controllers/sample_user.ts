import { getManager } from 'typeorm'
import { Users } from '../entity/Users'
import { newBCryptPassword } from '../helpers/bcrypt.helper'
import { ExpressFunc } from '../helpers/express_typing'

class SampleController{
  static addSampleAdmin: ExpressFunc = async function(req, res){

      console.log('Inserting sample users into the database')
      let userRepository = getManager().getRepository(Users)
      const admin_check = await userRepository.findOne({where:{email:'admin@eis.hokudai.ac.jp'}})
      // This is for admin
      if( admin_check === undefined){
        let admin = new Users()
        admin.email = 'admin@eis.hokudai.ac.jp'
        const [salt, crypted_password] = newBCryptPassword("admin")
        admin.crypted_password = crypted_password
        admin.salt = salt
        admin.family_name = 'family'
        admin.given_name = "given"
        admin.handle_name = 'handle'
        admin.birthday = new Date(2020,11,1) // counts month from 0 to 11.
        admin.email_mobile = "admin@gmail.com"
        admin.class_year_id =  98
        admin.admin = true
        admin.approval_state = 'approved'
        admin.activation_token = 'admin'
        admin.activation_status =  true
        await userRepository.save(admin)
        console.log('admin finish inserting')
      } else {
        console.log('admin is already existed.')
      }
      res.json({status:200})
  }

  static addSampleUser: ExpressFunc = async function(req, res){
      console.log('Inserting sample users into the database')
      let userRepository = getManager().getRepository(Users)
      const test_check = await userRepository.findOne({where:{email:'test@eis.hokudai.ac.jp'}})
      // This is for test
      if( test_check === undefined){
        let test = new Users()
        test.email = 'test@eis.hokudai.ac.jp'
        const [salt, crypted_password] = newBCryptPassword("test")
        test.crypted_password = crypted_password
        test.salt = salt
        test.family_name = '名字'
        test.given_name = "名前"
        test.handle_name = 'ハンドルネーム'
        test.birthday = new Date(2020,11,1) // counts month from 0 to 11.
        test.email_mobile = "test@gmail.com"
        test.class_year_id =  98
        test.approval_state = 'approved'
        test.activation_token = "test"
        test.activation_status =  true
        await userRepository.save(test)
        console.log('test is finish inserting')
      } else {
        console.log('test is already existed.')
      }
      res.json({status:200})
  }
}

export { SampleController }
