import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { Users } from '../entity/Users'


class AdminController{
  
  static UserBoard: ExpressFunc = async function(req, res){
    let userRepository = getManager().getRepository(Users)
    const users = await userRepository.find()
    res.json(users)
  }

  static UserDetail: ExpressFunc = async function(req, res){
    const id = parseInt(req.params.id)
    let userRepository = getManager().getRepository(Users)
    const user = await userRepository.findOne(id)
    res.json(user)
  }
}

export { AdminController }
