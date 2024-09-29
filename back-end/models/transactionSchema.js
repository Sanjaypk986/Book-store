import mongoose from "mongoose";

//schema
const transactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issueDate: {
    type: Date,
    required: true,
  },
  returnDate: {
    type: Date,
  },
  rent: {
    type: Number,
  },
  status: {
    type: String,
    enum: ['issued', 'returned'],
    required: true,
  },
});

//model creation
export const Transaction = mongoose.model("Transaction", transactionSchema);
