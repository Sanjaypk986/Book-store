import { Book } from "../models/bookSchema.js";


//create book
export const bookCreate = async (req, res) => {
   try{
    const {name , category , rent} = req.body
    if (!name || !category || !rent) {
        return res.status(400).json({
            sucess: false,
            message:"All fields required",
          });
    }
    const newBook = new Book({
        name,
        category,
        rent
      }); 

    //   save book 
    await newBook.save()

    res.status(200).json({success:true , message:"Book Added successfully"})
   } catch (error) {
      res.status(error.status || 500).json({
        sucess: false,
        message: error.message || "Internal server error",
      });
    }
  };