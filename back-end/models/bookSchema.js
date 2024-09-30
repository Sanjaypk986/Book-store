import mongoose from "mongoose";

//schema
const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    rent: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://www.creativefabrica.com/wp-content/uploads/2023/10/22/Vintage-Books-Digital-Graphic-82233438-1.png",
    },
  },
  { timestamps: true }
);

//model creation
export const Book = mongoose.model("Book", bookSchema);
