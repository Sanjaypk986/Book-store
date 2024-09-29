import express from 'express'
import { allBooks, bookCreate, searchBooks } from '../../controllers/bookController.js'

const router = express.Router()

router.post('/create',bookCreate)
router.get('/all-books',allBooks)
router.post('/search', searchBooks)



export default router