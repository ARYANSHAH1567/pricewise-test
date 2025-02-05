"use client"

import { scrapeAndStoreProduct } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import { FormEvent, useState } from 'react';

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes('amazon.com') || 
      hostname.includes('amazon.') || 
      hostname.endsWith('amazon')
    ) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const Searchbar = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchPrompt('');
    const isValidLink = isValidAmazonProductURL(searchPrompt);

    if (!isValidLink) {
      return alert('Please provide a valid Amazon link');
    }

    try {
      setIsLoading(true);
      
      // Scrape the product page
      const productId = await scrapeAndStoreProduct(searchPrompt);
      
      const url = `https://pricewise-test.vercel.app/products/${productId}`;
      router.push(url); 
      // Optionally handle further actions after the product is scraped
      // e.g., show a success message or update UI

    } catch (error) {
      console.error('Error scraping or storing product:', error);
      // Display an error message to the user
      alert('Failed to process the product. Please try again.');
    } finally { 
      setIsLoading(false);
    }
  };

  return (
    <form 
      className="flex flex-wrap gap-4 mt-12" 
      onSubmit={handleSubmit}
    >
      <input 
        type="text"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />
      <button 
        type="submit" 
        className="searchbar-btn"
        disabled={searchPrompt === ''}
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  );
};

export default Searchbar;
