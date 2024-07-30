import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    TrackedProd: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: []}],
    PastProd: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: []}],
    LikedProd: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: []}],
})

const User = mongoose.model('User',userSchema);
export default User;