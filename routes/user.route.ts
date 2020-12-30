/* Anything related with users are routing here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'

router.post('/login', UserController.login)
router.get('/profile', UserController.ProfileBoard)

router.post('/signup', UserController.signup)
router.post('/check-email', UserController.checkEmail)
router.post('/check-handle', UserController.checkHandle)
router.get('/activation/:userID/:token',UserController.verifyEmail )

router.post('/reset-password', UserController.resetPassword)
router.get('/verify-reset-password/:userID/:token', UserController.verifyResetPassword)
router.get('/cleanup', UserController.cleanup)
// For test
import { SampleController } from '../api/controllers/sample_user'
router.get('/add_sample', SampleController.addSampleUser)
router.get('/add_admin', SampleController.addSampleAdmin)

export { router as userRouter }
