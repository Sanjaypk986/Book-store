import mongoose from "mongoose";

//schema
 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, //email regex validation
    },
    password: {
        type: String,
        required: true,
    },
})

//model creation
export const User = mongoose.model('User', userSchema);