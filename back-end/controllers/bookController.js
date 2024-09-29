import { Book } from "../models/bookSchema.js";

//create book
export const bookCreate = async (req, res) => {
  try {
    const { name, category, rent } = req.body;
    if (!name || !category || !rent) {
      return res.status(400).json({
        sucess: false,
        message: "All fields required",
      });
    }
    const newBook = new Book({
      name,
      category,
      rent,
    });

    //   save book
    await newBook.save();

    res.status(200).json({
      success: true,
      message: "Book Added successfully",
      data: newBook,
    });
  } catch (error) {
    res.status(error.status || 500).json({
      sucess: false,
      message: error.message || "Internal server error",
    });
  }
};

// get all books
export const allBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res
      .status(200)
      .json({ success: true, message: "fetched all books", data: books });
  } catch (error) {
    res.status(error.status || 500).json({
      sucess: false,
      message: error.message || "Internal server error",
    });
  }
};

export const searchBooks = async (req, res) => {
  try {
    const { category, search, minRent, maxRent } = req.query;

    const query = {};

    //   search query
    if (search) {
      query.name = new RegExp(search, "i"); // 'i' for case-insensitive
    }

    //category query
    if (category) {
      query.category = new RegExp(`^${category}$`, "i"); //case-insensitive
    }

    if (minRent || maxRent) {
      // rent filtering greater than or less than
      query.rent = {};
      if (minRent) query.rent.$gte = Number(minRent);
      if (maxRent) query.rent.$lte = Number(maxRent);
    }
    // Find books from the query
    const books = await Book.find(query);

    res
      .status(200)
      .json({ success: true, message: "filtering books", data: books });
  } catch (error) {
    res.status(error.status || 500).json({
      sucess: false,
      message: error.message || "Internal server error",
    });
  }
};
