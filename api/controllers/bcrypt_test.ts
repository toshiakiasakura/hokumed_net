/** BCrypt test module.
 *  In the end, should be thrown away. 
 */
import bcrypt from 'bcrypt'
const saltRounds = 10

const salt = bcrypt.genSaltSync(saltRounds)
const hash = bcrypt.hashSync("error", salt)
console.log("This is error converting")
console.log(salt, hash)
for (var i = 5; i < 10; i++){
  let salt = bcrypt.genSaltSync(i)
  let hash = bcrypt.hashSync("error", salt)
  console.log(i)
  console.log(salt)
  console.log(hash)
}

console.log("Cheking hokuinet can be solved?")
const salt_what = '7Rrzqs3VU9RTsrep2qsi'
const myPassword = 'hokuinet' + salt_what
const salt_hokui = '$2a$10$WAUpEogEaID7V.Dl8S9pie'
const hash_js= bcrypt.hashSync(myPassword, salt_hokui)
const hash_hokui = '$2a$10$WAUpEogEaID7V.Dl8S9piekvbLW3FIXUQRUrYk5qxP13Kqvz5R0Vi'
console.log(hash_js)
console.log(hash_hokui)
console.log(bcrypt.compareSync(myPassword,hash_hokui))
