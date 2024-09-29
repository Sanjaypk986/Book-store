import express from "express";
import userRouter from "./userRoutes.js";
import booksRouter from "./booksRoutes.js";
import transactionsRouter from "./transactionRoutes.js";
const v1Router = express.Router();

v1Router.use("/user", userRouter);
v1Router.use("/books", booksRouter);
v1Router.use("/transactions", transactionsRouter);

export default v1Router;
