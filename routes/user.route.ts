/* Anything related with users are routing here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'

router.post('/login', UserController.login)
router.post('/signup', UserController.signup)
// TO DO: router.post('/register', register)


// For test
import { addSampleUser, removeSampleUser } from '../api/controllers/sample_user'
router.get('/add_sample', addSampleUser )
router.get('/remove_sample', removeSampleUser)

export { router as userRouter }
