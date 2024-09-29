import express from 'express'
import { bookHistory, bookIssuedDate, bookRentHistory, bookReturnedDate, booksIssuedInDateRange, issuedBooks } from '../../controllers/transactionController.js'
import { authuser } from '../../middlewares/authUser.js'

const router = express.Router()

router.post('/issue-date',bookIssuedDate)
router.patch('/return-date',bookReturnedDate)
router.get('/book-history',bookHistory)
router.get('/bookrent-history', bookRentHistory)
router.get('/issued-books', issuedBooks)
router.get('/date-filter', booksIssuedInDateRange)



export default router