import express from 'express'
import { allTransactions, bookHistory, bookIssuedDate, bookRentHistory, bookReturnedDate, booksIssuedInDateRange, filterByDate, filterByDateAggrigate, issuedBooks } from '../../controllers/transactionController.js'

const router = express.Router()

router.post('/issue-date',bookIssuedDate)
router.patch('/return-date',bookReturnedDate)
router.get('/book-history',bookHistory)
router.get('/bookrent-history', bookRentHistory)
router.get('/issued-books', issuedBooks)
router.get('/date-filter', booksIssuedInDateRange)
router.get('/transactions',allTransactions)
router.get('/filter-transactions',filterByDate)
router.get('/aggregate-transactions',filterByDateAggrigate)



export default router