import bcrypt from 'bcrypt'
const saltRounds = 10

export const newBCryptPassword = (password: string) => {
  const saltPassword = "hogehoge" // This should be replaced with some what
  const salt = bcrypt.genSaltSync(saltRounds)
  const crypted_password = bcrypt.hashSync(password + saltPassword, salt)
  return( [saltPassword, crypted_password]  )
}
