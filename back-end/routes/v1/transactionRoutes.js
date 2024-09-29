import express from 'express'
import { bookIssuedDate, bookReturnedDate } from '../../controllers/transactionController.js'
import { authuser } from '../../middlewares/authUser.js'

const router = express.Router()

router.post('/issue-date',authuser,bookIssuedDate)
router.patch('/return-date',authuser,bookReturnedDate)




export default router