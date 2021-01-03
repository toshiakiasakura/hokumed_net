import express, { Request, Response} from 'express'
const router = express.Router()
import { AdminController } from '../api/controllers/admin.controller'
import { StudyController } from '../api/controllers/study.controller'

router.get('/user/approve/:id', AdminController.changeApproveStatus)
router.get('/user/change-admin/:id', AdminController.changeAdminStatus)

router.get('/multiple/semester', StudyController.SemesterBoard)
router.get('/one/semester/:id', StudyController.SemesterDetail)
router.post('/edit/semester/:id', StudyController.EditSemester)
router.post('/new/semester', StudyController.NewSemester)

router.get('/multiple/:kind',StudyController.SendMultipleObjects )
router.get('/one/:kind/:id',StudyController.SendOneObject)
router.get('/delete/:kind/:id',StudyController.DeleteOneObject)
router.post('/edit/:kind/:id',StudyController.EditOneObject)
router.post('/new/:kind',StudyController.NewOneObject)

router.get('*', (req:Request, res:Response) => {
  res.json({status:404})
})
export { router as adminRouter }
