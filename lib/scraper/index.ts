import axios from "axios";
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from "../utils";

export async function scrapeAmazonProduct(url: string) {
    if (!url) return;

    //BrightDta proxy configuration

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorized: false,
    }
    function extractDescription($:any) {
        return $('meta[name="description"]').attr('content');
    }

    try {
        //Fetch the product page
        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data);

        //Extract the product title
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole'),
            $('.a-price .a-offscreen'), // Added a-offscreen class selector
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('.a-text-price .a-offscreen'), // Added a-offscreen class selector
            $('#listPrice'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const outOfStock = $('.a-declarative span.a-size-medium.a-color-success' || '#availability span').text().trim().toLowerCase() === 'currently unavailable.'

        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') || '{}';

        const imageUrls = Object.keys(JSON.parse(images));

        const currency = extractCurrency($('.a-price-symbol'));

        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g,"");
        const starRatingText = $('i.a-icon.a-icon-star span.a-icon-alt').text().trim(); // Adjust the selector as needed
  
        // Use a regex to extract the number before "out of 5 stars"
        const starRatingMatch = starRatingText.match(/(\d+(\.\d+)?)/);
      
        const starRating = starRatingMatch ? parseFloat(starRatingMatch[0]) : null; // Extract the rating and convert to float
      
        const boughtText = $('#social-proofing-faceout-title-tk_bought span').text().trim();

        
        const description = extractDescription($);
        const data = {
            url,
            currency: currency || '$',
            image: imageUrls[0],
            title,
            currentPrice: Number(currentPrice) ||  Number(originalPrice),
            originalPrice: Number(originalPrice) || Number(currentPrice),
            priceHistory: [{
                curprice:currentPrice,
                orgprice:originalPrice
            }],
            discountRate: Number(discountRate),
            category: 'category',
            reviewsCount: starRating || 5,
            isOutOfStock: outOfStock,
            description:description,
            lowestPrice: Number(currentPrice) || Number(originalPrice),
            highestPrice: Number(originalPrice) || Number(currentPrice),
            averagePrice: Number(currentPrice) || Number(originalPrice),
            isTracked: false,
            isLiked: false,
            buyers:boughtText,
            users: []
        }
        return data;

    } catch (error: any) {
        throw new Error(`Failed to scrape product: ${error.message}`)
    }
};