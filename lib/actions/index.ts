"use server"

import { revalidatePath } from "next/cache";
import Prodcut from "../models/product.model";
import { scrapeAmazonProduct } from "../scraper";
import { connectToDB } from "../mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect"

export async function rethrowIfRedirectError(error: any) {
  if (isRedirectError(error)) {
    throw error
  }
}

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

export async function removeUserEmailFromProduct(productId: string, userEmail: string) {
    
    try {
        // Check if the product exists
        const product = await Prodcut.findById(productId);

        if (!product) {
            console.log('Product not found');
            return;
        }

        const userExists = product.users.some((user: { email: string; }) => user.email === userEmail);
        if (userExists) {
            // Remove the user from the product's users array
            await Prodcut.findByIdAndUpdate(
                productId,
                { $pull: { users: { email: userEmail } } },
                { new: true }
            );

            // Reload the product to get the updated users array
            const updatedProduct = await Prodcut.findById(productId);
            const size = updatedProduct.users.length;

            // If no users left, delete the product and redirect
            if (size === 0) {
               
                await Prodcut.findByIdAndDelete(productId);
                // Ensure the redirect happens only when appropriate
                redirect("/");
               
            } else {
                console.log("Size of users array:", size);
                // No need to redirect if the product still has users
                return { user:1 };
            }
        } else {
            console.log('User not found in product');
            return { error: 'User not found' };
        }
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
          }
        console.error('Error removing user:', error);
    }

 
}
