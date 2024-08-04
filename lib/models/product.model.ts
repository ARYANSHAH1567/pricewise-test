import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    url: { type: String, required: true, unique: true },
    currency: { type: String, required: true },
    image: { type: String, required: true },
    title: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    priceHistory: [
        {
            price: { type: Number, },
            date: {type: Date, default: Date.now}
        },
    ],
    lowestPrice: {type:Number},
    highestPrice: {type:Number},
    averagePrice: {type:Number},
    discountRate: {type:Number},
    description: {type:String},
    reviewsCount: {type:Number},
    rating: { type: Number },
    isOutOfStock: {type:Boolean,default:false},
    isTracked: {type:Boolean,default:false},
    isLiked: {type:Boolean,default:false},
    buyers: {type:String},
    users: [{
        email:{type:String}
    }],
    },
    {timestamps:true});


    const Product = mongoose.models.Product || mongoose.model('Product', productSchema);


    export default Product;