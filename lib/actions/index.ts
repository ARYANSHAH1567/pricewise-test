"use server"

import { revalidatePath } from "next/cache";
import Prodcut from "../models/product.model";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";


export async function scrapeAndStoreProduct(productUrl: string) {
    if (!productUrl) return;

    try {
        connectToDB();

        const scrappedProduct = await scrapeAmazonProduct(productUrl);

        if (!scrappedProduct) return;

        let product = scrappedProduct;

        const existingProduct = await Prodcut.findOne({ url: scrappedProduct.url });

        if (existingProduct) {
            const updatedPriceHistory: any = [
                ...existingProduct.priceHistory, { price: scrappedProduct.currentPrice }
            ]


            product = {
                ...scrappedProduct,
                priceHistory: updatedPriceHistory,
                lowestPrice: getLowestPrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),

            }
        };

        const newProduct = await Prodcut.findOneAndUpdate(
            { url: scrappedProduct.url },
            product,
            { upsert: true, new: true }
        );

        revalidatePath(`/products/${newProduct._id}`);

    } catch (error: any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}

export async function getProduct(productId: any) {
    try {
        connectToDB();

        const product = await Prodcut.findOne({ _id: productId });

        if (!product) return null;

        return product;
    } catch (error: any) {
        console.log(error);
    }
}

export async function getAllProducts() {
    try {
        connectToDB();

        const products = await Prodcut.find();
        return products;

    } catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        connectToDB();

        const currentProduct = await Prodcut.findById(productId);
        if (!currentProduct) return null;


        const similarProducts = await Prodcut.find({ _id: { $ne: productId }, }).limit(3)

        return similarProducts;
    } catch (error) {
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Prodcut.findById(productId);

        if (!product) return;

        const userExists = product.users.some((user: User) => user.email === userEmail);

        if (!userExists) {
            product.users.push({ email: userEmail });

            await product.save();

            const emailContent = await generateEmailBody(product, "WELCOME");

            await sendEmail(emailContent, [userEmail]);
        }

      


    } catch (error) {
        console.log(error);
    }
}