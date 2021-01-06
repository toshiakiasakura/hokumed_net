/**
 * Authentication,that is, functions before loggin in 
 * are placed here.
 */
import express from 'express'
const router = express.Router()
import { AuthController } from '../api/controllers/auth.controller'

router.post('/login', AuthController.login)
router.post('/signup', AuthController.signup)
router.post('/check-email', AuthController.checkEmail)
router.post('/check-handle', AuthController.checkHandle)
router.get('/multiple/year', AuthController.ClassYearBoard)
router.get('/activation/:userID/:token',AuthController.verifyEmail )

router.post('/reset-password', AuthController.resetPassword)
router.get('/verify-reset-password/:userID/:token', AuthController.verifyResetPassword)
router.get('/cleanup', AuthController.cleanup)

export { router as authRouter }