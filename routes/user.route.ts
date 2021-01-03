/* Anything related with users are routing here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'

// These codes are auth services, will be moved. 
router.post('/login', UserController.login)

router.post('/signup', UserController.signup)
router.post('/check-email', UserController.checkEmail)
router.post('/check-handle', UserController.checkHandle)
router.get('/activation/:userID/:token',UserController.verifyEmail )

router.post('/reset-password', UserController.resetPassword)
router.get('/verify-reset-password/:userID/:token', UserController.verifyResetPassword)
router.get('/cleanup', UserController.cleanup)


router.get('/profile', UserController.ProfileBoard)
router.get('/multiple/semester', UserController.SemesterBoard)
router.get('/multiple/file/:title_en/:kind', UserController.FileBoard)


// For test
import { SampleController } from '../api/controllers/sample_user'
router.get('/add_sample', SampleController.addSampleUser)
router.get('/add_admin', SampleController.addSampleAdmin)

export { router as userRouter }
