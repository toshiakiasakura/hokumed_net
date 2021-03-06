import express, { Request, Response} from 'express'
const router = express.Router()
import { AdminController } from '../api/controllers/admin.controller'
import { UtilsController } from '../api/controllers/utils.controller'

router.get('/user/approve/:id', AdminController.changeApproveStatus)
router.get('/user/change-admin/:id', AdminController.changeAdminStatus)
router.post('/user/check-handle',AdminController.checkHandle)

router.get('/multiple/user',UtilsController.UserBoard)
router.get('/one/user/:id', UtilsController.OneUser)
router.post('/edit/user/:id',AdminController.EditUser)
router.get('/delete/user/:id',AdminController.DeleteUser)

router.get('/multiple/semester', AdminController.SemesterBoard)
router.get('/one/semester/:id', UtilsController.OneSemester)
router.post('/edit/semester/:id', AdminController.EditSemester)
router.post('/new/semester', AdminController.NewSemester)
router.get('/delete/semester/:id',AdminController.DeleteSemester)

router.get('/multiple/notification', UtilsController.NotificationBoard)
router.get('/one/notification/:id', UtilsController.OneNotification)
router.post('/edit/notification/:id',AdminController.EditNotification)
router.post('/new/notification', AdminController.NewNotification)
router.get('/delete/notification/:id',AdminController.DeleteNotification)

router.get('/multiple/subject',UtilsController.SubjectBoard)
router.get('/one/subject/:id', UtilsController.OneSubject)
router.post('/edit/subject/:id',AdminController.EditSubject)
router.post('/new/subject',AdminController.NewSubject)
router.get('/delete/subject/:id',AdminController.DeleteSubject)

router.get('/multiple/year',UtilsController.ClassYearBoard)
router.get('/one/year/:id', UtilsController.OneClassYear)
router.post('/edit/year/:id',AdminController.EditClassYear)
router.post('/new/year',AdminController.NewClassYear)
router.get('/delete/year/:id',AdminController.DeleteClassYear)

router.get('*', (req:Request, res:Response) => {
  res.json({status:404})
})
export { router as adminRouter }
