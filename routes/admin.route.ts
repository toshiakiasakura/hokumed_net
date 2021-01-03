import express, { Request, Response} from 'express'
const router = express.Router()
import { AdminController } from '../api/controllers/admin.controller'

router.get('/user/approve/:id', AdminController.changeApproveStatus)
router.get('/user/change-admin/:id', AdminController.changeAdminStatus)

router.get('/multiple/semester', AdminController.SemesterBoard)
router.get('/one/semester/:id', AdminController.SemesterDetail)
router.post('/edit/semester/:id', AdminController.EditSemester)
router.post('/new/semester', AdminController.NewSemester)

router.get('/multiple/:kind',AdminController.SendMultipleObjects )
router.get('/one/:kind/:id',AdminController.SendOneObject)
router.get('/delete/:kind/:id',AdminController.DeleteOneObject)
router.post('/edit/:kind/:id',AdminController.EditOneObject)
router.post('/new/:kind',AdminController.NewOneObject)

router.get('*', (req:Request, res:Response) => {
  res.json({status:404})
})
export { router as adminRouter }
