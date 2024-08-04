"use server"

import { NextResponse } from 'next/server'
import Product from "../models/product.model";
import { scrapeAmazonProduct } from "../scraper";
import  connectToDB  from "../mongoose";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import {  useUser } from "@clerk/nextjs";
import { generateEmailBody, sendEmail } from "../nodemailer";
import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect"
import { getAuth } from "@clerk/nextjs/server";
import User from '../models/users.models';
import { stringify } from 'querystring';


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

      const existingProduct = await Product.findOne({ url: scrappedProduct.url });

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

      const newProduct = await Product.findOneAndUpdate(
          { url: scrappedProduct.url },
          product,
          { upsert: true, new: true }
      );

      return newProduct._id.toString();

  } catch (error: any) {
      throw new Error(`Failed to create/update product: ${error.message}`)
  }
}




export async function getProduct(productId: string) {
  try {
    await connectToDB();

    const product = await Product.findOne({ _id: productId }).lean();

    if (!product) throw new Error('Product not found');

    
    return product;
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return null; // Return null or an appropriate fallback value
  }
}


export async function getAllProducts() {
    try {
      await   connectToDB();

        const products = await Product.find();
        return products;

    } catch (error) {
        console.log(error);
    }
}

export async function getSimilarProducts(productId: string) {
    try {
        await connectToDB();

        const currentProduct = await Product.findById(productId);
        if (!currentProduct) return null;


        const similarProducts = await Product.find({ _id: { $ne: productId }, }).limit(3)

        return similarProducts;
    } catch (error) {
        console.log(error);
    }
}

export async function addUserEmailToProduct(productId: string, userEmail: string) {
    try {
        const product = await Product.findByIdAndUpdate(
            productId,
            { 
              isTracked: true,
              $addToSet: { users: { email: userEmail } },
            },
            { new: true } 
          );

          if (!product) return;

          const updatedUser = await User.findOneAndUpdate(
            { email: userEmail }, // Find the user by email
            { $push: { TrackedProd: productId } }, // Add productId to trackedProd array if it doesn't already exist
            { new: true } // Return the updated document
          );

          const emailContent = await generateEmailBody(product, "WELCOME");
          await sendEmail(emailContent, userEmail);

    } catch (error) {
        console.log(error);
    }
}

export async function removeUserEmailFromProduct(productId: string, userEmail: string) {
    
    try {
       const product = await Product.findByIdAndUpdate(
            productId,
            {
               isTracked: false,
               $pull: { users: { email: userEmail } },
             },
            { new: true } // This option returns the updated document
          );

        if (!product) {
            console.log('Product not found');
            return;
        }


        const updatedUser = await User.findOneAndUpdate(
            { email: userEmail },
            {
              $pull: { TrackedProd: { productId } }, // Remove productId from TrackedProd array
              $addToSet: { PastProd: productId } // Add productId to PastProd array if it doesn't already exist
            },
            { new: true } // Return the updated document
          );
          

                redirect("/");
               
    } catch (error) {
        if (isRedirectError(error)) {
            throw error;
          }
        console.error('Error removing user:', error);
    }

 
}

export async function getTrackedProd(userEmail: string) {
    if (!userEmail) return [];
  
    try {
      const user = await User.findOne({ email: userEmail }).populate('TrackedProd');
      if (!user) {
        throw new Error('User not found');
      }
      return user.TrackedProd || [];
    } catch (error) {
      console.error('Error fetching tracked products:', error);
      throw error;
    }
  }
  

export async function addToLiked(productId: string, userEmail: string)
{
    try{
        const product = await Product.findByIdAndUpdate(
            productId,
            { isLiked: true },
            { new: true } // This option returns the updated document
          );
    
          if (!product) return;
    
          const updatedUser = await User.findOneAndUpdate(
            { email: userEmail }, // Find the user by email
            { $push: { LikedProd: productId } }, // Add productId to trackedProd array if it doesn't already exist
            { new: true } // Return the updated document
          );



    } catch(e)
    {
        console.log(e);
    }    
}

export async function removeFromLiked(productId: string, userEmail: string)
{
    try{
        const product = await Product.findByIdAndUpdate(
            productId,
            { isLiked: false },
            { new: true } // This option returns the updated document
          );
    
          if (!product) return;
    
          const updatedUser = await User.findOneAndUpdate(
            { email: userEmail }, // Find the user by email
            { $pull: { LikedProd: productId } }, // Add productId to trackedProd array if it doesn't already exist
            { new: true } // Return the updated document
          );
    } catch(e)
    {
        console.log(e);
    }    
}