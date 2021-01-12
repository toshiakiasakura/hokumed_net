import express, { Request, Response} from 'express'
const router = express.Router()
import { AdminController } from '../api/controllers/admin.controller'
import { UtilsController } from '../api/controllers/utils.controller'

router.get('/user/approve/:id', AdminController.changeApproveStatus)
router.get('/user/change-admin/:id', AdminController.changeAdminStatus)
router.post('/user/check-handle',AdminController.checkHandle)

router.post('/edit/semester/:id', AdminController.EditSemester)
router.post('/new/semester', AdminController.NewSemester)

router.get('/multiple/semester', UtilsController.SemesterBoard)
router.get('/one/semester/:id', UtilsController.OneSemester)

router.get('/multiple/notification', UtilsController.NotificationBoard)
router.get('/one/notification/:id', UtilsController.OneNotification)

router.get('/multiple/subject',UtilsController.SubjectBoard)
router.get('/one/subject/:id', UtilsController.OneSubject)

router.get('/multiple/user',UtilsController.UserBoard)
router.get('/one/user/:id', UtilsController.OneUser)

router.get('/multiple/year',UtilsController.ClassYearBoard)
router.get('/one/year/:id', UtilsController.OneClassYear)

router.get('/delete/:kind/:id',AdminController.DeleteOneObject)
router.post('/edit/:kind/:id',AdminController.EditOneObject)
router.post('/new/:kind',AdminController.NewOneObject)

router.get('*', (req:Request, res:Response) => {
  res.json({status:404})
})
export { router as adminRouter }
