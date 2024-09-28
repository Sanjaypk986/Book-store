import express from 'express'
import { checkUser, loginUser, logoutUser, userCreate } from '../../controllers/userController.js'
import { authuser } from '../../middlewares/authUser.js'

const router = express.Router()

router.post('/create',userCreate)
router.post('/login',loginUser)
router.get('/logout',logoutUser)

// for front-end routing
router.get('/check-user',authuser,checkUser)

export default router