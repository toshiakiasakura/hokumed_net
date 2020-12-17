import express, { Request, Response} from 'express'
const router = express.Router()
import { UserBoard } from '../api/controllers/admin.controller'

router.get("/user", UserBoard)

router.get('*', (req:Request, res:Response) => {
  res.json({status:404})
})
export { router as adminRouter }
