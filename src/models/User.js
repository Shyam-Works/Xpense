import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        require: true,
        unique: true
    },
    email:{
        type: String,
        require: true,
        unique: true
    },
    password:{
        type: String,
        require: true
    },
    income: {
        type: Number,
        default: 0
    },
    expectedSaving: { 
        type: Number, 
        default: 0 
    },

},{timestamps: true});

export default mongoose.models.User || mongoose.model("User", UserSchema)