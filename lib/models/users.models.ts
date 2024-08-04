import mongoose from "mongoose";
import Product from "./product.model";

const userSchema = new mongoose.Schema({
    clerkId: {type:String,required:true},
    email: { type: String, required: true, unique: true},
    TrackedProd: [{ type: mongoose.Schema.Types.ObjectId, ref: Product, default: []}],
    PastProd: [{ type: mongoose.Schema.Types.ObjectId, ref: Product, default: []}],
    LikedProd: [{ type: mongoose.Schema.Types.ObjectId, ref: Product, default: []}],
})

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;