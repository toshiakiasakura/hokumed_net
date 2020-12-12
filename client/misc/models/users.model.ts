import { createConnection } from 'typeorm'
import { Users } from '../entity/Users'

export const returnSaltPassword = (email: string) => {
  createConnection()
  .then(async connection => {
      let usersRepository = connection.getRepository(Users)
      const users = await usersRepository.find({email:email})
      return(users[0])
  })
  .catch( (err) => console.log(err))

}
