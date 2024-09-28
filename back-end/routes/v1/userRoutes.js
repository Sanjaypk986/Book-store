import express from 'express'
import { userCreate } from '../../controllers/userController.js'

const router = express.Router()

router.post('/create',userCreate)

export default router