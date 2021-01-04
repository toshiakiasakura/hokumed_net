/** 
 * Functions after loggin in are placed here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'

router.get('/profile', UserController.ProfileBoard)
router.get('/multiple/semester', UserController.SemesterBoard)
router.get('/multiple/file/:title_en/:kind', UserController.FileBoard)
router.get('/file/:id', UserController.DownloadFile)
router.get('/multiple/notification', UserController.NotificationBoard )

export { router as userRouter }
