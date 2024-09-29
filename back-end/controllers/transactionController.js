import { Book } from "../models/bookSchema.js";
import { Transaction } from "../models/transactionSchema.js";
import { User } from "../models/userModel.js";

// issue date
export const bookIssuedDate = async (req, res) => {
  try {
    const { userId, username, date, book } = req.body;
    if (!date || !book || (!userId && !username)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // Find user by userId or username
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ name: username });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // find book using name
    const bookDetails = await Book.findOne({ name: book });
    if (!bookDetails) {
      return res
        .status(404)
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
    const { userId, username, date, book } = req.body;
    if (!date || !book || (!userId && !username)) {
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });
    }

    // Find user by userId or username
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (username) {
      user = await User.findOne({ name: username });
    }

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // find book using name
    const bookDetails = await Book.findOne({ name: book });
    if (!bookDetails) {
      return res
        .status(404)
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
      return res
        .status(400)
        .json({ success: false, message: "Book is not currently issued." });
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

// book history
export const bookHistory = async (req, res) => {
  try {
    const { book } = req.body;
    if (!book) {
      return res
        .status(400)
        .json({ success: false, message: "Book name is required" });
    }

    const bookDetails = await Book.findOne({ name: book }); //find books
    if (!bookDetails) {
      return res.status(404).json({
        success: false,
        message: "Book does not exist",
      });
    }
    const bookId = bookDetails._id;
    const transactions = await Transaction.find({ bookId }); //find transactions
    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "transaction history not available",
      });
    }
    // Filtering  for previous transactions
    const previousTransactions = transactions.filter(
      (transaction) => transaction.status === "returned"
    );
    // Find for current transactions
    const currentTransaction = await Transaction.findOne({
      bookId,
      status: "issued",
    }).populate("userId", "name email");

    const history = {
      totalIssued: transactions.length,
      currentHolder: currentTransaction
        ? currentTransaction.userId
        : "Not currently issued",
    };
    res.status(200).json({
      success: true,
      message: "History fetched",
      data: history,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// book rent history
export const bookRentHistory = async (req, res) => {
  try {
    const { book } = req.body;
    if (!book) {
      return res
        .status(400)
        .json({ success: false, message: "Book name is required" });
    }

    const bookDetails = await Book.findOne({ name: book }); //find books
    if (!bookDetails) {
      return res.status(404).json({
        success: false,
        message: "Book does not exist",
      });
    }
    const bookId = bookDetails._id;
    const transactions = await Transaction.find({ bookId }); //find transactions
    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "transaction history not available",
      });
    }
    // Filter only returned
    const returnedTransactions = transactions.filter(
      (transaction) => transaction.status === "returned"
    );

    // Calculate total rent
    const totalRent = returnedTransactions.reduce((acc, transaction) => {
      return acc + (transaction.rent || 0);
    }, 0); //inital acc value

    res.status(200).json({
      success: true,
      message: "Book rent history fetched",
      data: totalRent,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// list of books issued to that person
export const issuedBooks = async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId && !userName) {
      return res
        .status(400)
        .json({ success: false, message: "User ID or Username is required" });
    }

    // Find user by userId or username
    let user;
    if (userId) {
      user = await User.findById(userId);
    } else if (userName) {
      user = await User.findOne({ name: userName });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const transactions = await Transaction.find({ userId: user._id }).populate(
      "bookId"
    );

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No books found" });
    }

    // Filter only issued books
    const issuedBooks = transactions.filter(
      (transaction) => transaction.status === "issued"
    );

    res.status(200).json({
      success: true,
      message: "Fetched all issued books",
      data: issuedBooks,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

// date wise
export const booksIssuedInDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "start date and end date are required",
      });
    }

    // Convert dates
    const start = new Date(startDate);
    const end = new Date(endDate);

    const transactions = await Transaction.find({
      issueDate: { $gte: start, $lte: end }, //greater than less than  date
      status: "issued",
    }).populate("bookId userId"); // Populate book and user details

    if (!transactions.length) {
      return res.status(404).json({
        success: false,
        message: "No books were issued in the given date range",
      });
    }

    const issuedBooks = transactions.map((transaction) => ({
      book: transaction.bookId.name, // Assuming book name is stored
      issuedTo: transaction.userId.name, // Assuming user name is stored
      issueDate: transaction.issueDate,
    }));

    res.status(200).json({
      success: true,
      message: "Books issued in the date range fetched successfully",
      data: issuedBooks,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
