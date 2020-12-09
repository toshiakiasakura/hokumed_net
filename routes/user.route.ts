/* Anything related with users are routing here.
 */
import express from 'express'
const router = express.Router()
import {login} from '../api/controllers/users.controller'

router.post('/login', login)
// TO DO: router.post('/register', register)

export { router as userRouter }
