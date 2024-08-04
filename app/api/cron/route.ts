import Product from "@/lib/models/product.model";
import connectToDB from "@/lib/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 30;
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        await connectToDB();

        const products = await Product.find({});

        if (!products || products.length === 0) {
            return NextResponse.json({ message: "No products found" }, { status: 404 });
        }

        const updatedProducts = await Promise.all(
            products.map(async (currentProduct) => {
                try {
                    const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
                    if (!scrapedProduct || typeof scrapedProduct.currentPrice === 'undefined') {
                        console.log(`Failed to scrape product or missing data for URL: ${currentProduct.url}`);
                        return null;
                    }

                    const updatedPriceHistory = [
                        ...currentProduct.priceHistory,
                        {
                            price: scrapedProduct.currentPrice,
                            date: new Date(), // Include the date for historical records
                        },
                    ];

                    const product = {
                        ...scrapedProduct,
                        priceHistory: updatedPriceHistory,
                        lowestPrice: getLowestPrice(updatedPriceHistory),
                        highestPrice: getHighestPrice(updatedPriceHistory),
                        averagePrice: getAveragePrice(updatedPriceHistory),
                        users: currentProduct.users, // Preserve users
                        isTracked: currentProduct.isTracked,
                        isLiked: currentProduct.isLiked,
                    };

                    const updatedProduct = await Product.findOneAndUpdate(
                        { url: product.url },
                        { $set: product },
                        { new: true, upsert: true } // Upsert if not exists
                    );

                    if (updatedProduct) {
                        const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct);

                        if (emailNotifType) {
                            const productInfo = {
                                title: updatedProduct.title,
                                url: updatedProduct.url,
                            };
                            const emailContent = await generateEmailBody(productInfo, emailNotifType);
                            const userEmails = updatedProduct.users.map((user: any) => user.email);
                            await sendEmail(emailContent, userEmails);
                        }
                    }

                    return updatedProduct;
                } catch (error:any) {
                    console.log(`Error processing product: ${currentProduct.url} - ${error.message}`);
                    return null;
                }
            })
        );

        const filteredProducts = updatedProducts.filter(product => product !== null);
        console.log("Filtered Products:", filteredProducts);

        return NextResponse.json({
            message: "Ok",
            data: filteredProducts,
        });

    } catch (error: any) {
        console.log(`Error in GET handler: ${error.message}`);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
