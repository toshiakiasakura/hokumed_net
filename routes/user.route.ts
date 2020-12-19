/* Anything related with users are routing here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'

router.post('/login', UserController.login)
router.post('/signup', UserController.signup)
router.get('/profile', UserController.ProfileBoard)
// TO DO: router.post('/register', register)


// For test
import { SampleController } from '../api/controllers/sample_user'
router.get('/add_sample', SampleController.addSampleUser)
router.get('/add_admin', SampleController.addSampleAdmin)

export { router as userRouter }
