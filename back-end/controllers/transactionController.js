import { Book } from "../models/bookSchema.js";
import { Transaction } from "../models/transactionSchema.js";

// issue date
export const bookIssuedDate = async (req, res) => {
  try {
    const user = req.user;
    const { date, book } = req.body;
    if (!date || !book) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // find book using name
    const bookDetails = await Book.findOne({ name: book });
    if (!bookDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Book does not exists" });
    }
    // Check if the book is already issued to the user
    const existingTransaction = await Transaction.findOne({
      bookId: bookDetails._id,
      userId: user._id,
      status: "issued",
    });
    if (existingTransaction) {
      return res
        .status(400)
        .json({ success: false, message: "Book is already issued to you." });
    }

    const newBookIssue = new Transaction({
      bookId: bookDetails._id,
      userId: user._id,
      issueDate: date,
      status: "issued",
    });
    await newBookIssue.save();

    res.status(200).json({
      success: true,
      message: "Book issue date stored in the database",
      data: newBookIssue,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// return date
export const bookReturnedDate = async (req, res) => {
  try {
    const user = req.user;
    const { date, book } = req.body;
    if (!date || !book) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // find book using name
    const bookDetails = await Book.findOne({ name: book });
    if (!bookDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Book does not exists" });
    }

    // find transaction using name
    const transactionDetails = await Transaction.findOne({
      bookId: bookDetails._id,
      userId: user._id,
      status: "issued",
    });
    if (!transactionDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Transaction doest not exists" });
    }
    if (transactionDetails.status !== "issued") {
        return res.status(400).json({ success: false, message: "Book is not currently issued." });
      }
      
    transactionDetails.returnDate = new Date(date); //assign return date
    // getting date to compare
    const issueDate = new Date(transactionDetails.issueDate);
    const returnDate = new Date(transactionDetails.returnDate);
    // Get the difference in days
    const calculateDays = (returnDate - issueDate) / (1000 * 60 * 60 * 24); // convert  difference in days
    const calculateRent = Math.round(calculateDays) * bookDetails.rent;

    transactionDetails.rent = calculateRent;
    transactionDetails.status = "returned";

    // Save the updated transaction
    await transactionDetails.save();

    res.status(200).json({
      success: true,
      message: "Book returned date stored in the database",
      data: transactionDetails,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
