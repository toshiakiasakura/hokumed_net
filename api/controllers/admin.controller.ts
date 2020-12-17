import { ExpressFunc } from '../helpers/express_typing'
import { getManager } from 'typeorm'
import { Users } from '../entity/Users'


export const UserBoard: ExpressFunc = async function(req, res){
  let userRepository = getManager().getRepository(Users)
  const users = await userRepository.find()
  res.json(users)
}
