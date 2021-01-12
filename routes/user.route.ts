/** 
 * Functions after loggin in are placed here.
 */
import express from 'express'
const router = express.Router()
import { UserController } from '../api/controllers/users.controller'
import { UtilsController } from '../api/controllers/utils.controller'

router.get('/profile', UserController.ProfileBoard)
router.post('/profile/edit', UserController.EditProfile)
router.post('/profile/password', UserController.ChangePassword)

router.get('/multiple/semester', UtilsController.SemesterBoard)
router.get('/multiple/file/:title_en/:kind', UserController.FileBoard)
router.get('/multiple/notification/', UtilsController.NotificationBoard )
router.get('/multiple/subject', UtilsController.SubjectBoard)
router.get('/one/notification/:id', UtilsController.OneNotification)

router.post('/upload/file', UserController.UploadFile)
router.get('/delete/file/:id', UserController.DeleteFile)
router.get('/file/:id', UserController.DownloadFile)

export { router as userRouter }
