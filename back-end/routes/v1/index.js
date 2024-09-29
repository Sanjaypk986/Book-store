import express from 'express'
import userRouter from './userRoutes.js'
import booksRouter from './booksRoutes.js'
const v1Router = express.Router();

v1Router.use('/user' , userRouter)
v1Router.use('/books' , booksRouter)

export default v1Router